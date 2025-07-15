'use client'

import { SourceID, getEnvironment, getSource } from '@v2/environments'
import { useAppState } from '@v2/state/DataProviderOnClient'
import { ElementType, createContext, useContext, useState } from 'react'

interface VoteButtonFocusContextValue {
  setIsVoteButtonHovered: (hovered: boolean) => void
  setIsVoteButtonFocused: (focused: boolean) => void
  isVoteButtonHovered: boolean
  isVoteButtonFocused: boolean
  bidId: number
  sourceId: SourceID
}

const VoteButtonFocusContext =
  createContext<VoteButtonFocusContextValue | null>(null)

export function useVoteButtonFocus() {
  const context = useContext(VoteButtonFocusContext)
  if (!context) {
    // Return no-op functions if context is not available
    return {
      setIsVoteButtonHovered: () => {},
      setIsVoteButtonFocused: () => {},
      isVoteButtonHovered: false,
      isVoteButtonFocused: false,
      bidId: 0,
      sourceId: '' as SourceID,
    }
  }
  return context
}

type PolymorphicProps<E extends ElementType> = {
  as?: E
  sourceId: SourceID
  bidId: number
  children: React.ReactNode
} & React.ComponentPropsWithoutRef<E>

export function BidWrapper<E extends ElementType = 'article'>({
  as,
  sourceId,
  bidId,
  children,
  className,
  ...otherProps
}: PolymorphicProps<E>) {
  const { state } = useAppState()
  const { currentRoundDataPerSource } = state

  // Check if we're already within a BidWrapper context
  const existingContext = useContext(VoteButtonFocusContext)
  const shouldProvideContext = !existingContext

  // Context state - each BidWrapper manages its own
  const [isVoteButtonHovered, setIsVoteButtonHovered] = useState(false)
  const [isVoteButtonFocused, setIsVoteButtonFocused] = useState(false)

  const Component = as || 'article'
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
  let focusStateDataAttribute = ''
  if (shouldProvideContext && isHoveringVoteButton) {
    if (userHasVotedOnThisBid) {
      focusStateDataAttribute = 'is-voted-on-focused'
    } else if (userHasVotedInThisTranche) {
      // User has voted on another bid in this tranche, so this is a "change vote" interaction
      focusStateDataAttribute = 'is-change-vote-focused'
    } else {
      // Normal vote focus
      focusStateDataAttribute = 'is-vote-focused'
    }
  }

  const contextValue: VoteButtonFocusContextValue = {
    setIsVoteButtonHovered,
    setIsVoteButtonFocused,
    isVoteButtonHovered,
    isVoteButtonFocused,
    bidId,
    sourceId,
  }

  const element = (
    <Component
      className={className}
      data-is-voted-on={userHasVotedOnThisBid ? 'true' : undefined}
      data-is-below-threshold={isBelowVoteThreshold ? 'true' : undefined}
      data-is-vote-focused={
        focusStateDataAttribute === 'is-vote-focused' ? 'true' : undefined
      }
      data-is-voted-on-focused={
        focusStateDataAttribute === 'is-voted-on-focused' ? 'true' : undefined
      }
      data-is-change-vote-focused={
        focusStateDataAttribute === 'is-change-vote-focused'
          ? 'true'
          : undefined
      }
      {...otherProps}
    >
      {children}
    </Component>
  )

  // Only provide context if we're the innermost BidWrapper
  return shouldProvideContext ? (
    <VoteButtonFocusContext.Provider value={contextValue}>
      {element}
    </VoteButtonFocusContext.Provider>
  ) : (
    element
  )
}
