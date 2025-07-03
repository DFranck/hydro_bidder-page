import { SourceID, getEnvironment, getSource } from '@v2/environments'
import { useAppState } from '@v2/state/DataProviderOnClient'
import { useMemo } from 'react'

export type BidThemeColor = 'blue' | 'green' | 'beige'

/**
 * Determines the theme color for a bid based on its voting state and threshold status.
 *
 * @param sourceId - The source identifier for the bid
 * @param bidId - The bid identifier
 * @returns The theme color as a CSS custom property value
 */
export function useBidThemeColor(sourceId: SourceID, bidId: number): string {
  const { state } = useAppState()
  const { currentRoundDataPerSource } = state

  return useMemo(() => {
    const walletData = currentRoundDataPerSource?.[sourceId]?.walletData
    const userVotes = walletData?.votes || []

    const augmentedBids = currentRoundDataPerSource?.[sourceId]?.augmentedBids ?? []
    const bid = augmentedBids?.find((bid) => bid.id === bidId)

    if (!bid) {
      return 'var(--color-palette-blue)' // Default blue theme
    }

    const environment = getEnvironment()
    const source = getSource(environment, sourceId)
    const voteThreshold = source.voteThresholds[bid.trancheId as keyof typeof source.voteThresholds]
    const isBelowVoteThreshold = bid.vote_perc < voteThreshold

    // Check if user has voted on this specific bid
    const userHasVotedOnThisBid = userVotes.some((vote: any) => vote.prop_id === bidId)

    // Check if user has voted on any bid in this tranche
    const userHasVotedInThisTranche = userVotes.some((vote: any) => {
      const votedBid = augmentedBids.find((b) => b.id === vote.prop_id)
      return votedBid && votedBid.trancheId === bid.trancheId
    })

    // Determine theme color based on state
    if (userHasVotedOnThisBid) {
      return 'var(--color-palette-green)' // Voted on this bid
    } else if (isBelowVoteThreshold) {
      return 'var(--color-palette-beige)' // Below threshold
    } else if (userHasVotedInThisTranche) {
      return 'var(--color-palette-blue)' // Voted elsewhere in tranche, but not on this bid
    } else {
      return 'var(--color-palette-blue)' // Default blue theme
    }
  }, [sourceId, bidId, currentRoundDataPerSource])
}
