"use client"

import {
  LockEntryWithPower,
  VoteWithPower,
} from "@/app/ts_types/HydroBase.types"
import { useToasts } from "@/components/Toasts"
import { fetchAssetListWithPrices } from "@/contract-apis/fetchAssetListWithPrices"
import { fetchGlobalState } from "@/contract-apis/fetchGlobalState"
import { fetchMyAllLockups } from "@/contract-apis/fetchMyAllLockups"
import { fetchMyVotes } from "@/contract-apis/fetchMyVotes"
import {
  fetchNumiaData,
  SanitizedBidFromNumia,
} from "@/contract-apis/fetchNumiaData"
import { fetchProposals } from "@/contract-apis/fetchProposals"
import { fetchRoundState } from "@/contract-apis/fetchRoundState"
import { fetchUserVotingData } from "@/contract-apis/fetchUserVotingData"
import { useChain } from "@cosmos-kit/react"
import { groupBy, keyBy, mapValues, sumBy } from "lodash"
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"

interface ContractContextType {
  bidsByRoundId: Record<number, AugmentedBid[]>
  preHydroBids: SanitizedBidFromNumia[]
  currentRoundMetadata: RoundMetadata
  globalMetadata: GlobalMetadata
  isLoading: boolean
}

export interface AugmentedBid extends SanitizedBidFromNumia {
  deploymentDuration: number
  estimatedRewardForUser: number | null
  estimatedRewardDeltaAsPercentage: number | null
  hasVotedForBid: boolean
  votingPowerPercentage: number
}

export interface RoundMetadata {
  averageAPR: number
  roundId: number
  roundEnd: Date
  usersVotedBidIds: number[]
  usersVotingPower: number | null
  usersEstimatedReward: number | null
}

export interface GlobalMetadata {
  maxLockedTokens: number
  totalLockedTokens: number
  usersLockups: LockEntryWithPower[]
}

const initialContractContext: ContractContextType = {
  bidsByRoundId: {},
  isLoading: false,
  preHydroBids: [],
  currentRoundMetadata: {
    averageAPR: 0,
    roundEnd: new Date(),
    roundId: 0,
    usersVotedBidIds: [],
    usersVotingPower: null,
    usersEstimatedReward: null,
  },
  globalMetadata: {
    totalLockedTokens: 0,
    maxLockedTokens: 0,
    usersLockups: [],
  },
}

const ContractContext = createContext<ContractContextType>(
  initialContractContext
)

export function ContractContextProvider({ children }: { children: ReactNode }) {
  const { address } = useChain("neutron")
  const { setToasts } = useToasts()
  const [isLoading, setIsLoading] = useState(false)
  const [contextValue, setContextValue] = useState<ContractContextType>(
    initialContractContext
  )

  useEffect(() => {
    setIsLoading(true)
    setToasts([
      {
        message: "Loading...",
        variant: "working",
      },
    ])
    ;(async () => {
      const [
        assetListWithPrices,
        dataFromContract,
        usersLockups,
        dataFromNumia,
        userVotingData,
      ] = await Promise.all([
        fetchAssetListWithPrices(),
        fetchGlobalState(),
        address ? fetchMyAllLockups(address) : Promise.resolve([]),
        fetchNumiaData(),
        fetchUserVotingData(address),
      ])

      const currentRoundBidsFromContract = await fetchProposals(
        dataFromContract.currentRound,
        dataFromContract.tranches[0].id
      )

      const bidsFromContractById = keyBy(
        currentRoundBidsFromContract,
        "proposal_id"
      )

      const { roundEnd, totalVotingPower } = await fetchRoundState(
        dataFromContract.currentRound
      )

      const atomPrice =
        assetListWithPrices.get(
          "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9"
        )?.priceUsd ?? 0

      const { postHydroBids, preHydroBids } = dataFromNumia

      const usersVotingPower = userVotingData.votingPower

      const userVotes = !address
        ? new Map<number, VoteWithPower | null>()
        : await fetchMyVotes(
            address,
            dataFromContract.currentRound,
            dataFromContract.tranches.map((tranche) => tranche.id)
          )

      const bidsByRoundId = groupBy(postHydroBids, "round")

      const usersChosenBidId = userVotes.get(
        dataFromContract.currentRound
      )?.prop_id

      const usersChosenBid = postHydroBids.find(
        (bid) => bid.id === String(usersChosenBidId)
      )

      const usersChosenBidReward =
        usersChosenBid &&
        (usersChosenBid.onchainTributeUsdc ?? 0) *
          (usersChosenBid.votingPower /
            (usersChosenBid.votingPower + usersVotingPower))

      const augmentedBidsByRoundId = mapValues(bidsByRoundId, (bidsInRound) => {
        const totalVotingPower = sumBy(bidsInRound, "votingPower")

        return bidsInRound.map((bid) => {
          const deploymentDuration =
            bidsFromContractById[bid.id]?.deployment_duration ?? -1

          const offchainTributes = bid.offchainTribute.filter(
            (tribute) => tribute.amount > 0
          )

          const onchainTributes = bid.onchainTributeAssets.filter(
            (tribute) => tribute.amount > 0
          )

          const usersVoteForBid = userVotes.get(Number(bid.id))

          const estimatedRewardForUser =
            bid.votingPower === 0 || !usersVotingPower
              ? 0
              : bid.onchainTributeUsdc *
                (bid.votingPower / (bid.votingPower + usersVotingPower))

          const estimatedRewardDeltaAsPercentage =
            (usersChosenBidReward &&
              estimatedRewardForUser &&
              (usersChosenBidReward - estimatedRewardForUser) /
                usersChosenBidReward) ||
            null

          return {
            ...bid,
            deploymentDuration,
            estimatedRewardDeltaAsPercentage,
            estimatedRewardForUser,
            hasVotedForBid: !!usersVoteForBid,
            offchainTribute: offchainTributes,
            onchainTributeAssets: onchainTributes,
            votingPowerPercentage: bid.votingPower / totalVotingPower,
          }
        })
      })

      const totalTributeValue = sumBy(
        bidsByRoundId[dataFromContract.currentRound],
        (bid) => bid.onchainTributeUsdc
      )

      const averageAPR =
        (totalTributeValue /
          (dataFromContract.totalLockedTokens / 1e6) /
          atomPrice) *
        12

      setContextValue({
        bidsByRoundId: augmentedBidsByRoundId,
        isLoading,
        preHydroBids,
        currentRoundMetadata: {
          averageAPR,
          roundId:
            process.env.NODE_ENV === "development"
              ? 0
              : dataFromContract.currentRound,
          roundEnd: new Date(parseInt(roundEnd) / 1e6),
          usersVotedBidIds: Array.from(userVotes.values())
            .map((vote) => vote?.prop_id)
            .filter((id): id is number => id !== undefined),
          usersVotingPower,
          usersEstimatedReward: usersChosenBidReward ?? null,
        },
        globalMetadata: {
          totalLockedTokens: dataFromContract.totalLockedTokens,
          maxLockedTokens: dataFromContract.constants.max_locked_tokens ?? 0,
          usersLockups,
        },
      })

      setToasts([])
      setIsLoading(false)
    })()
  }, [address])

  return (
    <ContractContext.Provider value={contextValue}>
      {children}
    </ContractContext.Provider>
  )
}

export function useContractContext() {
  const context = useContext(ContractContext)

  if (context === undefined) {
    throw new Error("useContractContext must be used within a ContractProvider")
  }

  return context
}
