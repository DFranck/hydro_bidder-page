import {
  HydroBaseClient,
  HydroBaseQueryClient,
} from "@/app/ts_types/HydroBase.client"
import { Proposal, VoteWithPower } from "@/app/ts_types/HydroBase.types"
import { TributeBaseQueryClient } from "@/app/ts_types/TributeBase.client"
import { Tribute } from "@/app/ts_types/TributeBase.types"
import { GlobalState, RoundState } from "@/app/types"
import {
  DEFAULT_EPOCH_LENGTH,
  getPriceFeedUrl,
  NEUTRON_DEFAULT_RPC,
} from "@/config"
import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate"
import { ChainContext } from "@cosmos-kit/core"
import { useQuery } from "@tanstack/react-query"
import { unstable_cache } from "next/cache"

let clientInstance: CosmWasmClient | null = null

// Define a constant for the revalidation period
const CACHE_REVALIDATE_SECONDS = 5

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

  const atomPrice =
    assetListWithPrices.get(
      "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9"
    )?.priceUsd ?? 0

  return {
    lastProposalTranches,
    currentProposalTranches,
    lastVotingPower,
    currentVotingPower,
    globalState: {
      ...globalState,
      atomPrice,
    },
    currentProposalTributes,
    lastProposalTributes,
    currentRoundEnd,
    assetListWithPrices,
  }
}

// returns a map of proposal id to tributes
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
  if (!process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS) {
    throw new Error("Hydro contract address not set")
  }

  const client = await getCosmWasmClient()
  const hydroQueryClient = new HydroBaseQueryClient(
    client,
    process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
  )

  const [
    constants,
    currentRound,
    totalLockedTokens,
    tranches,
    whitelistAdmins,
    whitelist,
    bidDescriptions,
  ] = await Promise.all([
    unstable_cache(
      async () => {
        return hydroQueryClient
          .constants()
          .then((response) => response.constants)
      },
      ["constants"],
      { revalidate: CACHE_REVALIDATE_SECONDS }
    )(),
    unstable_cache(
      async () => {
        return hydroQueryClient
          .currentRound()
          .then((response) => response.round_id)
      },
      ["currentRound"],
      { revalidate: CACHE_REVALIDATE_SECONDS }
    )(),
    unstable_cache(
      async () => {
        return hydroQueryClient
          .totalLockedTokens()
          .then((response) => response.total_locked_tokens)
      },
      ["totalLockedTokens"],
      { revalidate: CACHE_REVALIDATE_SECONDS }
    )(),
    unstable_cache(
      async () => {
        return hydroQueryClient.tranches().then((response) => response.tranches)
      },
      ["tranches"],
      { revalidate: CACHE_REVALIDATE_SECONDS }
    )(),
    unstable_cache(
      async () => {
        return hydroQueryClient
          .whitelistAdmins()
          .then((response) => response.admins)
      },
      ["whitelistAdmins"],
      { revalidate: CACHE_REVALIDATE_SECONDS }
    )(),
    unstable_cache(
      async () => {
        return hydroQueryClient
          .whitelist()
          .then((response) => response.whitelist)
      },
      ["whitelist"],
      { revalidate: CACHE_REVALIDATE_SECONDS }
    )(),
    unstable_cache(
      async () => {
        return fetch(
          "https://raw.githubusercontent.com/informalsystems/hydro-bid-descriptions/refs/heads/main/bid-descriptions.json"
        ).then((response) => response.json())
      },
      ["bidDescriptions"],
      { revalidate: CACHE_REVALIDATE_SECONDS }
    )(),
  ])

  return {
    constants: {
      ...constants,
      max_locked_tokens: 20_000 * 1e6, // TODO: Stop hardcoding this
      max_locked_tokens_per_address: 200 * 1e6, // TODO: Stop hardcoding this
    },
    currentRound,
    totalLockedTokens,
    tranches,
    whitelistAdmins,
    whitelist,
    bidDescriptions,
  }
}

export const fetchRoundState = async (roundId: number): Promise<RoundState> => {
  if (!process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS) {
    throw new Error("Hydro contract address not set")
  }

  const client = await getCosmWasmClient()
  const hydroQueryClient = new HydroBaseQueryClient(
    client,
    process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
  )

  const [roundEnd, totalVotingPower] = await Promise.all([
    unstable_cache(
      async () => {
        return hydroQueryClient
          .roundEnd({ roundId })
          .then((response) => response.round_end)
      },
      ["roundEnd", roundId.toString()],
      { revalidate: CACHE_REVALIDATE_SECONDS }
    )(),
    unstable_cache(
      async () => {
        return hydroQueryClient
          .roundTotalVotingPower({ roundId })
          .then((response) => response.total_voting_power)
      },
      ["roundTotalVotingPower", roundId.toString()],
      { revalidate: CACHE_REVALIDATE_SECONDS }
    )(),
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
  if (!process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS) {
    throw new Error("Hydro contract address not set")
  }

  const client = await getCosmWasmClient()
  const hydroQueryClient = new HydroBaseQueryClient(
    client,
    process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
  )
  // query all proposals and enrich with topNProposals percentage data
  // return proposals sorted by percentage in descending order
  const response = await unstable_cache(
    async () => {
      const roundProposals = await hydroQueryClient.roundProposals({
        limit: 20,
        roundId,
        startFrom: 0,
        trancheId,
      })
      const topNProposals = await hydroQueryClient.topNProposals({
        numberOfProposals: 20,
        roundId,
        trancheId,
      })
      const enrichedProposals = roundProposals.proposals
        .map((proposal) => {
          const matchingTopProposal = topNProposals.proposals.find(
            (topProposal) => topProposal.proposal_id === proposal.proposal_id
          )
          return {
            ...proposal,
            percentage: matchingTopProposal
              ? matchingTopProposal.percentage
              : proposal.percentage,
          }
        })
        .sort((a, b) => parseInt(b.percentage) - parseInt(a.percentage))

      return { proposals: enrichedProposals }
    },
    ["topNProposals", roundId.toString(), trancheId.toString()],
    { revalidate: CACHE_REVALIDATE_SECONDS }
  )()
  return response.proposals
}

export const fetchProposalTributes = async (
  roundId: number,
  trancheId: number,
  proposalId: number
): Promise<Tribute[]> => {
  if (!process.env.NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS) {
    throw new Error("Tribute contract address not set")
  }

  const client = await getCosmWasmClient()
  const tributeQueryClient = new TributeBaseQueryClient(
    client,
    process.env.NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS
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
  if (!process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS) {
    throw new Error("Hydro contract address not set")
  }

  const client = await getCosmWasmClient()
  const hydroQueryClient = new HydroBaseQueryClient(
    client,
    process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
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
  if (!process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS) {
    throw new Error("Hydro contract address not set")
  }

  const client = await getCosmWasmClient()
  const hydroQueryClient = new HydroBaseQueryClient(
    client,
    process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
  )
  const lockups = await hydroQueryClient.allUserLockups({
    address: myAddress,
    limit,
    startFrom,
  })
  return lockups.lockups
}

export const fetchMyExpiredLockups = async (myAddress: string) => {
  if (!process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS) {
    throw new Error("Hydro contract address not set")
  }

  const client = await getCosmWasmClient()
  const hydroQueryClient = new HydroBaseQueryClient(
    client,
    process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
  )

  const response = await hydroQueryClient.expiredUserLockups({
    address: myAddress,
    limit,
    startFrom,
  })
  return response.lockups
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
  if (!process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS) {
    throw new Error("Hydro contract address not set")
  }

  const client = await getSigningCosmWasmClient()
  const hydroClient = new HydroBaseClient(
    client,
    address,
    process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
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
  if (!process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS) {
    throw new Error("Hydro contract address not set")
  }

  const client = await getSigningCosmWasmClient()

  const hydroClient = new HydroBaseClient(
    client,
    address,
    process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
  )
  const response = await hydroClient.refreshLockDuration(
    { lockDuration: DEFAULT_EPOCH_LENGTH * lockDuration, lockIds: [lockId] },
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
          d.delegation.validator_address === validator.operator_address
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
  if (!process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS) {
    throw new Error("Hydro contract address not set")
  }

  const client = await getCosmWasmClient()
  const hydroQueryClient = new HydroBaseQueryClient(
    client,
    process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
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

type AssetListEntry = {
  token: string
  symbol: string
  decimals: number
  coingeckoId?: string
  priceUsd?: number
}

export const fetchAssetListWithPrices = async (): Promise<
  Map<string, AssetListEntry>
> => {
  // Fetch the asset list
  const response = await fetch(
    "https://raw.githubusercontent.com/astroport-fi/astroport-token-lists/refs/heads/main/tokenLists/neutron.json",
    {
      next: { revalidate: CACHE_REVALIDATE_SECONDS }, // Revalidate every 5 minutes
    }
  )
  const data: AssetListEntry[] = await response.json()

  // Extract Coingecko IDs from assets that have them
  const coingeckoIds = data
    .filter((asset) => asset.coingeckoId)
    .map((asset) => asset.coingeckoId as string)

  // Fetch prices using getPriceFeedUrl
  const pricesResponse = await fetch(
    getPriceFeedUrl([...coingeckoIds, "switcheo"]),
    {
      next: { revalidate: CACHE_REVALIDATE_SECONDS }, // Revalidate every 5 minutes
    }
  )
  const prices: Record<string, { usd: number }> = await pricesResponse.json()

  // Create a Map with token as key and updated AssetListEntry as value
  const assetMap = new Map<string, AssetListEntry>()

  data.forEach((asset) => {
    const updatedAsset =
      asset.coingeckoId && prices[asset.coingeckoId]
        ? { ...asset, priceUsd: prices[asset.coingeckoId].usd }
        : asset
    assetMap.set(asset.token, updatedAsset)
  })

  return assetMap
}
