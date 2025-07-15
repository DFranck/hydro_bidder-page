import { SourceID, getEnvironment, getSource } from '@v2/environments'
import { useAppState } from '@v2/state/DataProviderOnClient'
import { useMemo } from 'react'

export type BidThemeColor = 'blue' | 'green' | 'beige'

export interface BidThemeColors {
  themeColor: string
  textColor: string
}

/**
 * Pure function to calculate bid theme colors based on voting state and threshold status.
 * This can be used by hooks that need to calculate theme colors for multiple bids.
 */
export function calculateBidThemeColors(
  sourceId: SourceID,
  bidId: number,
  currentRoundDataPerSource: any
): BidThemeColors {
  const walletData = currentRoundDataPerSource?.[sourceId]?.walletData
  const userVotes = walletData?.votes || []

  const augmentedBids = currentRoundDataPerSource?.[sourceId]?.augmentedBids ?? []
  const bid = augmentedBids?.find((bid: any) => bid.id === bidId)

  if (!bid) {
    return {
      themeColor: 'var(--color-palette-blue)',
      textColor: 'var(--color-foreground)'
    }
  }

  const environment = getEnvironment()
  const source = getSource(environment, sourceId)
  const voteThreshold = source.voteThresholds[bid.trancheId as keyof typeof source.voteThresholds]
  const isBelowVoteThreshold = bid.vote_perc < voteThreshold

  // Check if user has voted on this specific bid
  const userHasVotedOnThisBid = userVotes.some((vote: any) => vote.prop_id === bidId)

  // Check if user has voted on any bid in this tranche
  const userHasVotedInThisTranche = userVotes.some((vote: any) => {
    const votedBid = augmentedBids.find((b: any) => b.id === vote.prop_id)
    return votedBid && votedBid.trancheId === bid.trancheId
  })

  // Determine theme color and text color based on state
  if (userHasVotedOnThisBid) {
    return {
      themeColor: 'var(--color-palette-green)',
      textColor: 'var(--color-background)' // Dark text for bright green
    }
  } else if (isBelowVoteThreshold) {
    return {
      themeColor: 'var(--color-palette-beige)',
      textColor: 'var(--color-background)' // Dark text for bright beige
    }
  } else if (userHasVotedInThisTranche) {
    return {
      themeColor: 'var(--color-palette-blue)',
      textColor: 'var(--color-foreground)' // White text for dark blue
    }
  } else {
    return {
      themeColor: 'var(--color-palette-blue)',
      textColor: 'var(--color-foreground)' // White text for dark blue
    }
  }
}

/**
 * Determines the theme color and text color for a bid based on its voting state and threshold status.
 *
 * @param sourceId - The source identifier for the bid
 * @param bidId - The bid identifier
 * @returns An object containing both theme color and text color as CSS custom property values
 */
export function useBidThemeColor(sourceId: SourceID, bidId: number): BidThemeColors {
  const { state } = useAppState()
  const { currentRoundDataPerSource } = state

  return useMemo(() => {
    return calculateBidThemeColors(sourceId, bidId, currentRoundDataPerSource)
  }, [sourceId, bidId, currentRoundDataPerSource])
}
