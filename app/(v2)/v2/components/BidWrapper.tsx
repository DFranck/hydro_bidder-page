'use client'

import { SourceID, getEnvironment, getSource } from '@v2/environments'
import { useAppState } from '@v2/state/DataProviderOnClient'
import { createContext, useContext, useState } from 'react'
import { twMerge } from 'tailwind-merge'

interface VoteButtonFocusContextValue {
  setVoteButtonHovered: (hovered: boolean) => void
  setVoteButtonFocused: (focused: boolean) => void
}

const VoteButtonFocusContext =
  createContext<VoteButtonFocusContextValue | null>(null)

export function useVoteButtonFocus() {
  const context = useContext(VoteButtonFocusContext)
  if (!context) {
    // Return no-op functions if context is not available (e.g., when nested)
    return {
      setVoteButtonHovered: () => {},
      setVoteButtonFocused: () => {},
    }
  }
  return context
}

export function BidWrapper({
  sourceId,
  bidId,
  children,
  className,
  ...otherProps
}: React.ComponentProps<'div'> & {
  sourceId: SourceID
  bidId: number
  children: React.ReactNode
}) {
  const { state } = useAppState()
  const { currentRoundDataPerSource } = state

  // Check if we're already within a BidWrapper context
  const existingContext = useContext(VoteButtonFocusContext)
  const shouldProvideContext = !existingContext

  const [isVoteButtonHovered, setIsVoteButtonHovered] = useState(false)
  const [isVoteButtonFocused, setIsVoteButtonFocused] = useState(false)
  const isHoveringVoteButton = isVoteButtonHovered || isVoteButtonFocused

  const walletData = currentRoundDataPerSource?.[sourceId]?.walletData
  const userVotes = walletData?.votes || []

  const userVotedOnBidIds = userVotes
    .filter((vote: any) => vote.prop_id === bidId)
    .map((vote: any) => vote.prop_id)

  const userHasVotedOnThisBid = userVotedOnBidIds.includes(bidId)

  const augmentedBids =
    currentRoundDataPerSource?.[sourceId]?.augmentedBids ?? []
  const bid = augmentedBids?.find((bid) => bid.id === bidId)

  const environment = getEnvironment()
  const source = getSource(environment, sourceId)
  const voteThreshold = bid?.trancheId
    ? source.voteThresholds[bid.trancheId as keyof typeof source.voteThresholds]
    : null
  const isBelowVoteThreshold =
    bid && voteThreshold ? bid.vote_perc < voteThreshold : false

  // Check if user has voted on any bid in this tranche
  const userHasVotedInThisTranche = bid
    ? userVotes.some((vote: any) => {
        const votedBid = augmentedBids.find((b) => b.id === vote.prop_id)
        return votedBid && votedBid.trancheId === bid.trancheId
      })
    : false

  // Determine focus state for CSS variants - only apply if we should provide context
  let focusStateClass = ''
  if (shouldProvideContext && isHoveringVoteButton) {
    if (userHasVotedOnThisBid) {
      focusStateClass = 'is-voted-on-focused'
    } else if (userHasVotedInThisTranche) {
      // User has voted on another bid in this tranche, so this is a "change vote" interaction
      focusStateClass = 'is-change-vote-focused'
    } else {
      // Normal vote focus
      focusStateClass = 'is-vote-focused'
    }
  }

  const contextValue: VoteButtonFocusContextValue = {
    setVoteButtonHovered: (hovered: boolean) => setIsVoteButtonHovered(hovered),
    setVoteButtonFocused: (focused: boolean) => setIsVoteButtonFocused(focused),
  }

  const articleElement = (
    <article
      className={twMerge(
        userHasVotedOnThisBid && 'is-voted-on',
        isBelowVoteThreshold && 'is-below-threshold',
        focusStateClass,
        className,
      )}
      {...otherProps}
    >
      {children}
    </article>
  )

  // Only provide context if we're the innermost BidWrapper
  return shouldProvideContext ? (
    <VoteButtonFocusContext.Provider value={contextValue}>
      {articleElement}
    </VoteButtonFocusContext.Provider>
  ) : (
    articleElement
  )
}
