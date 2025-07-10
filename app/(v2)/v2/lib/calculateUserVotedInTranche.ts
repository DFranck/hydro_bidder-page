import { Tranche } from '@/app/ts_types/HydroBase.types'
import { BidRevampMetrics } from '@/contract-apis/types'

interface Vote {
  prop_id: number
  power: string
}

interface WalletData {
  votes: Vote[]
}

export function calculateUserVotedInTranche(
  tranche: Tranche,
  allBids: BidRevampMetrics[],
  walletData?: WalletData
): { userVotedInTranche: boolean; userVotedOnBidId: number | null } {
  if (!walletData?.votes) {
    return { userVotedInTranche: false, userVotedOnBidId: null }
  }

  const userVotes = walletData.votes

  // Find if user voted for any bid in this tranche
  for (const vote of userVotes) {
    const bidForVote = allBids.find((bid) => bid.id === vote.prop_id)
    if (bidForVote?.trancheId === tranche.id) {
      return {
        userVotedInTranche: true,
        userVotedOnBidId: bidForVote.id
      }
    }
  }

  return { userVotedInTranche: false, userVotedOnBidId: null }
}
