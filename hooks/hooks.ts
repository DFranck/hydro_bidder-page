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
    HYDRO_CONTRACT_ADDRESS,
    NEUTRON_DEFAULT_RPC,
    TRIBUTE_CONTRACT_ADDRESS,
} from "@/config"
import { displayNeutronDenom } from "@/lib/utils"
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

    // Replace IBC denoms with token names
    const tribute = tributes.tributes.map((tribute) => ({
        ...tribute,
        funds: {
            ...tribute.funds,
            denom: displayNeutronDenom(tribute.funds.denom),
        },
    }))

    return tribute
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
): Promise<Validator[]> => {
    const restEndpoint = await chain.getRestEndpoint()

    const response = await fetch(
        `${restEndpoint}cosmos/staking/v1beta1/delegators/${delegatorAddress}/validators`
    ).then((res) => res.json())

    if (!response.validators) {
        throw new Error("Failed to fetch validators")
    }

    return response.validators
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
