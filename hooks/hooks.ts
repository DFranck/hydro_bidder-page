import { useQuery } from "@tanstack/react-query"
import {
    HydroBaseQueryClient,
    HydroBaseClient,
} from "../app/ts_types/HydroBase.client"
import { TributeBaseQueryClient } from "../app/ts_types/TributeBase.client"
import {
    CosmWasmClient,
    SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate"
import { Proposal, VoteWithPower } from "../app/ts_types/HydroBase.types"
import { Tribute } from "../app/ts_types/TributeBase.types"
import { GlobalState, RoundState } from "../app/types"
import { ChainContext } from "@cosmos-kit/core"
import {
    DEFAULT_EPOCH_LENGTH,
    DEFAULT_TOP_N,
    getPriceFeedUrl,
    HYDRO_CONTRACT_ADDRESS,
    NEUTRON_DEFAULT_RPC,
    TRIBUTE_CONTRACT_ADDRESS,
} from "@/config"
import { displayNeutronDenom } from "@/lib/utils"
import { FEED_COINS_BY_SYMBOL } from "@/config/feed"
let clientInstance: CosmWasmClient | null = null

// convenience func that allows doing contract queries on both server and client
// without the need to wait for the client side to finish executing useChain()
const getCosmWasmClient = async (): Promise<CosmWasmClient> => {
    if (!clientInstance) {
        clientInstance = await CosmWasmClient.connect(NEUTRON_DEFAULT_RPC)
    }
    return clientInstance
}

const staleTime = 10000
const limit = 10000
const startFrom = 0

export type Validator = {
    operator_address: string
    description: {
        moniker: string
    }
    validator_bond_shares: string
    liquid_shares: string
    delegator_shares: string
}

export type Delegation = {
    delegation: {
        delegator_address: string
        validator_address: string
        shares: string
    }
    balance: {
        denom: string
        amount: string
    }
}

export type ValidatorDelegation = {
    validator: Validator
    delegation: Delegation
    delegation_balance: {
        denom: string
        amount: string
    }
}

export async function fetchDashboardData() {
    const globalState = await fetchGlobalState()

    const { currentRound, tranches } = globalState

    const lastRound = currentRound - 1
    const lastRoundExists = lastRound > -1

    // TODO: Lots of sequential "awaits" here, but shouldn't matter since this stuff will be fetched on the server
    const currentProposals = await Promise.all(
        tranches.map((tranche) => {
            return fetchProposals(currentRound, tranche.id)
        })
    )

    let currentRoundEnd = undefined
    let currentVotingPower = undefined

    const currentRoundData = await fetchRoundState(currentRound)
    currentRoundEnd = currentRoundData.roundEnd
    currentVotingPower = currentRoundData.totalVotingPower

    // The first round that Hydro runs, there will be no deployed proposals
    let lastProposalTranches = undefined
    let lastVotingPower = undefined
    let lastProposalTributes = undefined
    if (lastRoundExists) {
        const lastProposals = await Promise.all(
            tranches.map((tranche) => fetchProposals(lastRound, tranche.id))
        )
        lastVotingPower = await fetchRoundState(lastRound).then(
            (response) => response.totalVotingPower
        )

        lastProposalTranches = tranches.reduce((acc, tranche, idx) => {
            return acc.set(tranche.id, lastProposals[idx])
        }, new Map<number, Proposal[]>())

        lastProposalTributes = await fetchProposalTributesForRound(
            lastProposalTranches,
            lastRound
        )
    }

    const currentProposalTranches: Map<number, Proposal[]> = tranches.reduce(
        (acc, tranche, idx) => {
            return acc.set(tranche.id, currentProposals[idx])
        },
        new Map<number, Proposal[]>()
    )

    const currentProposalTributes = await fetchProposalTributesForRound(
        currentProposalTranches,
        currentRound
    )

    const assetListWithPrices = await fetchAssetListWithPrices()

    return {
        lastProposalTranches,
        currentProposalTranches,
        lastVotingPower,
        currentVotingPower,
        globalState,
        currentProposalTributes,
        lastProposalTributes,
        currentRoundEnd,
        assetListWithPrices,
    }
}

async function fetchProposalTributesForRound(
    proposalTranches: Map<number, Proposal[]>,
    round: number
): Promise<Map<number, Tribute[]>> {
    const allProposals = Array.from(proposalTranches.values()).flat()
    const tributePromises = allProposals.map((proposal) =>
        fetchProposalTributes(
            round,
            proposal.tranche_id,
            proposal.proposal_id
        ).then((tributes) => ({ proposal, tributes }))
    )
    const tributesResults = await Promise.all(tributePromises)

    const proposalTributes = new Map<number, Tribute[]>()
    tributesResults.forEach(({ proposal, tributes }) => {
        proposalTributes.set(proposal.proposal_id, tributes)
    })

    return proposalTributes
}


export const fetchGlobalState = async (): Promise<GlobalState> => {
    const client = await getCosmWasmClient()
    const hydroQueryClient = new HydroBaseQueryClient(
        client,
        HYDRO_CONTRACT_ADDRESS
    )

    const [
        constants,
        currentRound,
        totalLockedTokens,
        tranches,
        whitelistAdmins,
        whitelist,
    ] = await Promise.all([
        hydroQueryClient.constants().then((response) => response.constants),
        hydroQueryClient.currentRound().then((response) => response.round_id),
        hydroQueryClient
            .totalLockedTokens()
            .then((response) => response.total_locked_tokens),
        hydroQueryClient.tranches().then((response) => response.tranches),
        hydroQueryClient.whitelistAdmins().then((response) => response.admins),
        hydroQueryClient.whitelist().then((response) => response.whitelist),
    ])

    return {
        constants,
        currentRound,
        totalLockedTokens,
        tranches,
        whitelistAdmins,
        whitelist,
    }
}

export const fetchRoundState = async (roundId: number): Promise<RoundState> => {
    const client = await getCosmWasmClient()
    const hydroQueryClient = new HydroBaseQueryClient(
        client,
        HYDRO_CONTRACT_ADDRESS
    )

    const [roundEnd, totalVotingPower] = await Promise.all([
        hydroQueryClient
            .roundEnd({ roundId })
            .then((response) => response.round_end),
        hydroQueryClient
            .roundTotalVotingPower({ roundId })
            .then((response) => response.total_voting_power),
    ])

    return {
        roundEnd,
        totalVotingPower: BigInt(totalVotingPower),
    }
}

export const fetchProposals = async (
    roundId: number,
    trancheId: number
): Promise<Proposal[]> => {
    const client = await getCosmWasmClient()
    const hydroQueryClient = new HydroBaseQueryClient(
        client,
        HYDRO_CONTRACT_ADDRESS
    )
    const response = await hydroQueryClient.topNProposals({
        numberOfProposals: 20,
        roundId,
        trancheId,
    })
    return response.proposals
}

export const fetchProposalTributes = async (
    roundId: number,
    trancheId: number,
    proposalId: number
): Promise<Tribute[]> => {
    const client = await getCosmWasmClient()
    const tributeQueryClient = new TributeBaseQueryClient(
        client,
        TRIBUTE_CONTRACT_ADDRESS
    )

    const query = {
        roundId,
        trancheId,
        proposalId,
        limit: 10,
        startFrom: 0,
    }

    const tributes = await tributeQueryClient.proposalTributes(query)

    return tributes.tributes
}

export const useProposals = (roundId: number, trancheId: number) => {
    return useQuery({
        queryKey: ["proposals", roundId, trancheId],
        queryFn: () => fetchProposals(roundId, trancheId),
        staleTime,
    })
}

export const useRoundState = (roundId: number) => {
    return useQuery({
        queryKey: ["roundState", roundId],
        queryFn: () => fetchRoundState(roundId),
        staleTime,
    })
}

export const fetchMyVotes = async (
    myAddress: string,
    roundId: number,
    trancheIds: number[]
) => {
    const client = await getCosmWasmClient()
    const hydroQueryClient = new HydroBaseQueryClient(
        client,
        HYDRO_CONTRACT_ADDRESS
    )

    const votePromises = trancheIds.map((trancheId) => {
        try {
            return hydroQueryClient.userVote({
                address: myAddress,
                roundId: roundId,
                trancheId: trancheId,
            })
        } catch (err) {
            return {
                vote: null,
            }
        }
    })

    // return all promises resolved or rejected
    const votes = await Promise.allSettled(votePromises)

    const votesByTranche = trancheIds.reduce((acc, trancheId, index) => {
        if (votes[index].status === "fulfilled") {
            acc.set(trancheId, votes[index].value.vote)
        }
        return acc
    }, new Map<number, VoteWithPower | null>())

    return votesByTranche
}

export const fetchMyAllLockups = async (myAddress: string) => {
    const client = await getCosmWasmClient()
    const hydroQueryClient = new HydroBaseQueryClient(
        client,
        HYDRO_CONTRACT_ADDRESS
    )
    const lockups = await hydroQueryClient.allUserLockups({
        address: myAddress,
        limit,
        startFrom,
    })
    return lockups.lockups
}

export const fetchMyExpiredLockups = async (myAddress: string) => {
    const client = await getCosmWasmClient()
    const hydroQueryClient = new HydroBaseQueryClient(
        client,
        HYDRO_CONTRACT_ADDRESS
    )

    const response = await hydroQueryClient.expiredUserLockups({
        address: myAddress,
        limit,
        startFrom,
    })
    return response.lockups
}

export const useMyVotes = (
    myAddress: string,
    roundId: number,
    trancheIds: number[]
) => {
    return useQuery({
        queryKey: ["myVotes", myAddress, roundId, trancheIds],
        queryFn: () => fetchMyVotes(myAddress, roundId, trancheIds),
        staleTime,
    })
}

export const useMyLockups = (myAddress: string) => {
    return useQuery({
        queryKey: ["myLockups", myAddress],
        queryFn: () => fetchMyAllLockups(myAddress),
        staleTime,
    })
}

export const executeVote = async (
    getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>,
    address: string,
    proposalId: number,
    trancheId: number
) => {
    const client = await getSigningCosmWasmClient()
    const hydroClient = new HydroBaseClient(
        client,
        address,
        HYDRO_CONTRACT_ADDRESS
    )
    const response = await hydroClient.vote({ proposalId, trancheId }, "auto")
    return response
}

export const executeExtendLockup = async (
    getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>,
    address: string,
    lockId: number,
    lockDuration: number
) => {
    const client = await getSigningCosmWasmClient()

    const hydroClient = new HydroBaseClient(
        client,
        address,
        HYDRO_CONTRACT_ADDRESS
    )
    const response = await hydroClient.refreshLockDuration(
        { lockDuration: DEFAULT_EPOCH_LENGTH * lockDuration, lockId },
        "auto"
    )
    return response
}

export const fetchMyValidators = async (
    chain: ChainContext,
    delegatorAddress: string
): Promise<ValidatorDelegation[]> => {
    const restEndpoint = await chain.getRestEndpoint()

    const [validatorsResponse, delegationsResponse] = await Promise.all([
        fetch(
            `${restEndpoint}cosmos/staking/v1beta1/delegators/${delegatorAddress}/validators`
        ).then((res) => res.json()),
        fetch(
            `${restEndpoint}cosmos/staking/v1beta1/delegations/${delegatorAddress}`
        ).then((res) => res.json()),
    ])

    if (!validatorsResponse.validators) {
        throw new Error("Failed to fetch validators")
    }

    if (!delegationsResponse.delegation_responses) {
        throw new Error("Failed to fetch delegations")
    }

    const validators = validatorsResponse.validators
    const delegations = delegationsResponse.delegation_responses

    return validators
        .map((validator: Validator): ValidatorDelegation | null => {
            const delegation = delegations.find(
                (d: Delegation) =>
                    d.delegation.validator_address ===
                    validator.operator_address
            )
            if (delegation) {
                return {
                    validator,
                    delegation: delegation.delegation,
                    delegation_balance: delegation.balance,
                }
            }
            return null
        })
        .filter((item: ValidatorDelegation | null) => item !== null)
}

export const useMyValidators = (
    chain: ChainContext,
    delegatorAddress: string
) => {
    return useQuery({
        queryKey: ["myValidators", delegatorAddress],
        queryFn: () => fetchMyValidators(chain, delegatorAddress),
        staleTime,
    })
}

export const fetchAllValidators = async (
    restEndpoint: string
): Promise<Validator[]> => {
    const response = await fetch(
        `${restEndpoint}cosmos/staking/v1beta1/validators?pagination.limit=500`
    )
        .then((res) => res.json())
        .then((data) => data.validators)

    return response
}

export type UserVotingData = {
    votingPower: number
    lockups: {
        count: number
        lockedAtom: number
        firstExpireTs: number
    }
}

export const fetchUserVotingData = async (
    address: string
): Promise<UserVotingData> => {
    const client = await getCosmWasmClient()
    const hydroQueryClient = new HydroBaseQueryClient(
        client,
        HYDRO_CONTRACT_ADDRESS
    )

    let votingPower = 0
    let lockedAtom = {
        count: 0,
        lockedAtom: 0,
        firstExpireTs: 0,
    }

    try {
        const [power, lockups] = await Promise.all([
            hydroQueryClient.userVotingPower({ address }),
            hydroQueryClient.allUserLockups({ address, limit, startFrom }),
        ])
        votingPower = power.voting_power
        lockedAtom.lockedAtom = lockups.lockups.reduce((acc, lockup) => {
            return acc + parseInt(lockup.lock_entry.funds.amount)
        }, 0)
        lockedAtom.count = lockups.lockups.length
        lockedAtom.firstExpireTs = lockups.lockups.reduce((acc, lockup) => {
            const lockEnd = parseInt(lockup.lock_entry.lock_end)
            return acc === 0 || lockEnd < acc ? lockEnd : acc
        }, 0)
    } catch (error) {
        console.error("Error fetching user voting data:", error)
    }

    return {
        votingPower,
        lockups: lockedAtom,
    }
}

export const useUserVotingData = (address: string) => {
    return useQuery({
        queryKey: ["userVotingData", address],
        queryFn: () => fetchUserVotingData(address),
        staleTime,
    })
}

type TributesValuePerDenom = {
    amount: number
    apiId: string
}

type USDAmounts = {
    totalTributeValue: number
    atomPrice: number
}

export async function getTributeValuesFromPriceFeed(
    propsalTributes: Map<number, Tribute[]>
): Promise<USDAmounts> {
    let atomPrice = 0
    let totalValue = 0

    const trancheDenoms = tributesValuePerDenom(propsalTributes)
    const fetchDenoms: string[] = ["cosmos"] // always fetch atom
    const missingDenoms: string[] = []
    trancheDenoms.forEach((value, denom) => {
        if (value.apiId) {
            fetchDenoms.push(value.apiId)
        } else {
            missingDenoms.push(denom)
        }
    })

    try {
        // responds with: { cosmos: { usd: 4.13 }, ... }
        const res = await fetch(getPriceFeedUrl(fetchDenoms), {
            next: {
                revalidate: 5 * 60,
            },
        }).then((res) => res.json())
        atomPrice = res["cosmos"]["usd"]
        totalValue = Array.from(trancheDenoms.values()).reduce(
            (acc, { amount, apiId }) => {
                const price = res[apiId]["usd"] / 1e6
                return acc + price * amount
            },
            0
        )
    } catch {
        return { totalTributeValue: 0, atomPrice: 0 }
    }
    return { totalTributeValue: totalValue, atomPrice: atomPrice }
}

function tributesValuePerDenom(
    proposalTributes: Map<number, Tribute[]>
): Map<string, TributesValuePerDenom> {
    const trancheDenoms = new Map<
        string,
        {
            amount: number
            apiId: string
        }
    >()
    Array.from(proposalTributes.values())
        .flat()
        .forEach((t) => {
            const denom = t.funds.denom
            const amount = parseInt(t.funds.amount)
            if (trancheDenoms.has(denom)) {
                const current = trancheDenoms.get(denom)!
                current.amount += amount
                trancheDenoms.set(denom, current)
            } else {
                const apiId = FEED_COINS_BY_SYMBOL.get(denom)?.api_id
                trancheDenoms.set(denom, { amount, apiId: apiId ?? "" })
            }
        })

    return trancheDenoms
}

type AssetListEntry = {
    token: string
    symbol: string,
    decimals: number
    coingecko_id?: string,
    price_usd?: number
}

export const fetchAssetListWithPrices = async (): Promise<Map<string, AssetListEntry>> => {
    // Fetch the asset list
    const response = await fetch('https://raw.githubusercontent.com/astroport-fi/astroport-token-lists/refs/heads/main/tokenLists/neutron.json', {
        next: { revalidate: 5 * 60 }, // Revalidate every 5 minutes
    });
    const data: AssetListEntry[] = await response.json();

    // Extract Coingecko IDs from assets that have them
    const coingeckoIds = data
        .filter(asset => asset.coingecko_id)
        .map(asset => asset.coingecko_id as string);

    // Fetch prices using getPriceFeedUrl
    const pricesResponse = await fetch(getPriceFeedUrl(coingeckoIds), {
        next: { revalidate: 5 * 60 }, // Revalidate every 5 minutes
    });
    const prices: Record<string, { usd: number }> = await pricesResponse.json();

    // Create a Map with token as key and updated AssetListEntry as value
    const assetMap = new Map<string, AssetListEntry>();

    data.forEach(asset => {
        const updatedAsset = asset.coingecko_id && prices[asset.coingecko_id]
            ? { ...asset, price_usd: prices[asset.coingecko_id].usd }
            : asset;
        assetMap.set(asset.token, updatedAsset);
    });

    return assetMap;
};
