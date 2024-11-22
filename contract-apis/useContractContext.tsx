"use client"

import {
  LockEntryWithPower,
  VoteWithPower,
} from "@/app/ts_types/HydroBase.types"
import { useToasts } from "@/components/Toasts"
import { fetchGlobalState } from "@/contract-apis/fetchGlobalState"
import { fetchMyAllLockups } from "@/contract-apis/fetchMyAllLockups"
import { fetchMyVotes } from "@/contract-apis/fetchMyVotes"
import {
  fetchNumiaData,
  SanitizedBidFromNumia,
} from "@/contract-apis/fetchNumiaData"
import { fetchUserVotingData } from "@/contract-apis/fetchUserVotingData"
import { useChain } from "@cosmos-kit/react"
import { groupBy, mapValues, sumBy } from "lodash"
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
  roundMetadata: RoundMetadata
}

export interface AugmentedBid extends SanitizedBidFromNumia {
  estimatedRewardForUser: number | null
  estimatedRewardDeltaAsPercentage: number | null
  hasVotedForBid: boolean
  votingPowerPercentage: number
}

interface RoundMetadata {
  currentRound: number
  totalLockedTokens: number
  maxLockedTokens: number
  usersVotedBidIds: number[]
  usersVotingPower: number | null
  usersEstimatedReward: number | null
  usersLockups: LockEntryWithPower[]
}

const ContractContext = createContext<ContractContextType | undefined>(
  undefined
)

export function ContractContextProvider({ children }: { children: ReactNode }) {
  const { address } = useChain("neutron")
  const { setToasts } = useToasts()
  const [bidsByRoundId, setBidsByRoundId] = useState<
    Record<number, AugmentedBid[]>
  >({})
  const [preHydroBids, setPreHydroBids] = useState<SanitizedBidFromNumia[]>([])
  const [roundMetadata, setComputedRoundMetadata] = useState<RoundMetadata>({
    currentRound: 0,
    totalLockedTokens: 0,
    maxLockedTokens: 0,
    usersVotedBidIds: [],
    usersVotingPower: null,
    usersEstimatedReward: null,
    usersLockups: [],
  })

  useEffect(() => {
    ;(async () => {
      setToasts([
        {
          message: "Loading...",
          variant: "working",
        },
      ])

      const [dataFromContract, usersLockups, bidsData, userVotingData] =
        await Promise.all([
          fetchGlobalState(),
          address ? fetchMyAllLockups(address) : Promise.resolve([]),
          fetchNumiaData(),
          fetchUserVotingData(address),
        ])

      const { postHydroBids, preHydroBids } = bidsData

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
        (bid) => bid.id === usersChosenBidId
      )

      const usersChosenBidReward =
        usersChosenBid &&
        (usersChosenBid.onchainTributeUsdc ?? 0) *
          (usersChosenBid.votingPower /
            (usersChosenBid.votingPower + usersVotingPower))

      const augmentedBidsByRoundId = mapValues(bidsByRoundId, (bidsInRound) => {
        const totalVotingPower = sumBy(bidsInRound, "votingPower")

        return bidsInRound.map((bid) => {
          const offchainTributes = bid.offchainTribute.filter(
            (tribute) => tribute.amount > 0
          )

          const onchainTributes = bid.onchainTributeAssets.filter(
            (tribute) => tribute.amount > 0
          )

          const usersVoteForBid = userVotes.get(bid.id)

          const estimatedRewardForUser =
            bid.votingPower === 0
              ? bid.onchainTributeUsdc
              : bid.onchainTributeUsdc *
                (bid.votingPower / (bid.votingPower + usersVotingPower))

          const estimatedRewardDeltaAsPercentage =
            (usersChosenBidReward &&
              estimatedRewardForUser &&
              ((usersChosenBidReward - estimatedRewardForUser) /
                usersChosenBidReward) *
                100) ||
            null

          return {
            ...bid,
            estimatedRewardForUser,
            estimatedRewardDeltaAsPercentage,
            hasVotedForBid: !!usersVoteForBid,
            offchainTribute: offchainTributes,
            onchainTributeAssets: onchainTributes,
            votingPowerPercentage: bid.votingPower / totalVotingPower,
          }
        })
      })

      setComputedRoundMetadata({
        currentRound: dataFromContract.currentRound,
        totalLockedTokens: dataFromContract.totalLockedTokens,
        maxLockedTokens: dataFromContract.constants.max_locked_tokens ?? 0,
        usersVotedBidIds: Array.from(userVotes.values())
          .map((vote) => vote?.prop_id)
          .filter((id): id is number => id !== undefined),
        usersVotingPower,
        usersEstimatedReward: usersChosenBidReward ?? null,
        usersLockups,
      })

      setPreHydroBids(preHydroBids)

      setBidsByRoundId(augmentedBidsByRoundId)

      setToasts([])
    })()
  }, [])

  return (
    <ContractContext.Provider
      value={{
        bidsByRoundId,
        preHydroBids,
        roundMetadata,
      }}
    >
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
