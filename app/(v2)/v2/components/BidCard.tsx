'use client'

import { Icon } from '@/components/Icon'
import { OrphanController } from '@/components/OrphanController'
import { BidRevampMetrics } from '@/contract-apis/types'
import { SourceID, getEnvironment, getSource } from '@v2/environments'
import { useAppState } from '@v2/state/DataProviderOnClient'
import { useState } from 'react'
import { twJoin, twMerge } from 'tailwind-merge'
import { BidCardLogo } from './BidCardLogo'
import { BidDuration } from './BidDuration'
import { BidTributeApr } from './BidTributeApr'
import { BidVoteShare } from './BidVoteShare'
import { InternalLink } from './InternalLink'
import { VoteButton } from './VoteButton'

export const bidCardFields = [
  {
    key: 'duration',
    label: 'Duration',
    className: twJoin(
      'text-left',
      'ml-[calc(var(--spacing-bar-height-standard)+var(--spacing-tight)+var(--spacing-standard))]',
      '@card-is-row:text-center',
      '@card-is-row:ml-0',
      '@card-is-row:w-24',
    ),
    value: (bid: BidRevampMetrics, sourceId: SourceID) => (
      <BidDuration bidId={bid.id} sourceId={sourceId} />
    ),
  },
  {
    key: 'apr',
    label: 'APR',
    className: twJoin('text-center', '@card-is-row:w-24'),
    value: (bid: BidRevampMetrics, sourceId: SourceID) => (
      <BidTributeApr bidId={bid.id} sourceId={sourceId} />
    ),
  },
  {
    key: 'vote-percentage',
    label: 'Vote %',
    className: twJoin(
      'text-right',
      '@card-is-row:w-24',
      '@card-is-row:text-center',
    ),
    value: (bid: BidRevampMetrics, sourceId: SourceID) => (
      <BidVoteShare bidId={bid.id} sourceId={sourceId} />
    ),
  },
]

function TD({
  children,
  className,
  ...otherProps
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={twMerge(
        'grid',
        '@card-is-row:relative',
        '@card-is-row:table-cell',
        '@card-is-row:h-full',
        '@card-is-row:w-1',
        '@card-is-row:p-tight',
        '@card-is-row:align-middle',
        className,
      )}
      {...otherProps}
    >
      {children}
    </div>
  )
}

function FloatingCardElements({
  sourceId,
  bidId,
  isLoading,
  isFirstCell = false,
  isLastCell = false,
}: {
  sourceId: SourceID
  bidId: number
  isLoading: boolean
  isFirstCell?: boolean
  isLastCell?: boolean
}) {
  return (
    <>
      <InternalLink
        href={`/v2/bids/${sourceId}/${bidId}`}
        className={twJoin(
          'absolute inset-0 z-10',
          'cursor-pointer border-none bg-transparent',
        )}
        disabled={isLoading}
      />

      <div
        className={twMerge(
          'absolute inset-0 -z-10',
          'bg-theme-color/20',
          'transition-all',
          'group-hover/bid-card:bg-theme-color/40',
          'group-focus-within/bid-card:bg-theme-color/60!',
          '@card-is-row:block hidden',
          // Dimming when other bids are focused
          'is-vote-focused-elsewhere:opacity-50',
          'is-voted-on-focused-elsewhere:opacity-50',
          'is-change-vote-focused-elsewhere:opacity-50',
          // But not when this bid is the focused one
          'is-vote-focused:opacity-100!',
          'is-voted-on-focused:opacity-100!',
          'is-change-vote-focused:opacity-100!',
          // Highlight voted bids when in change-vote-focused mode
          'is-voted-on:is-change-vote-focused-elsewhere:theme-color-beige',
          'is-voted-on:is-change-vote-focused-elsewhere:bg-theme-color/60',
          'is-voted-on:is-change-vote-focused-elsewhere:opacity-100!',
          isFirstCell
            ? [
                'block',
                'rounded-standard',
                '@card-is-row:rounded-none',
                '@card-is-row:rounded-l-standard',
              ]
            : '',
          isLastCell ? 'rounded-r-standard' : '',
          !isFirstCell && !isLastCell ? 'rounded-none' : '',
        )}
      >
        <div
          className={twMerge(
            'is-voted-on:block hidden',
            'is-vote-focused:block',
            'is-change-vote-focused:block',
            '-inset-tightest absolute',
            'border-theme-color border-(length:--spacing-tightest)',
            'rounded-[calc(var(--radius-standard)+var(--spacing-tightest))]',
            isFirstCell &&
              '@card-is-row:rounded-r-none @card-is-row:border-r-0',
            isLastCell && '@card-is-row:rounded-l-none @card-is-row:border-l-0',
            !(isFirstCell || isLastCell) &&
              '@card-is-row:rounded-none @card-is-row:border-x-0',
          )}
        />
      </div>
    </>
  )
}

export function BidCard({
  sourceId,
  bidId,
  className,
  ...otherProps
}: React.ComponentProps<'div'> & {
  sourceId: SourceID
  bidId: number
}) {
  const { state } = useAppState()
  const { currentRoundDataPerSource, bidDescriptionsById, isLoading } = state

  const walletData = currentRoundDataPerSource?.[sourceId]?.walletData
  const userVotes = walletData?.votes || []

  const userVotedOnBidIds = userVotes
    .filter((vote: any) => vote.prop_id === bidId)
    .map((vote: any) => vote.prop_id)

  const userHasVotedOnThisBid = userVotedOnBidIds.includes(bidId)

  const augmentedBids =
    currentRoundDataPerSource?.[sourceId]?.augmentedBids ?? []
  const bid = augmentedBids?.find((bid) => bid.id === bidId)

  const [isVoteButtonHovered, setIsVoteButtonHovered] = useState(false)
  const [isVoteButtonFocused, setIsVoteButtonFocused] = useState(false)
  const isHoveringVoteButton = isVoteButtonHovered || isVoteButtonFocused

  // Check if user has voted on any bid in this tranche
  const userHasVotedInThisTranche = bid
    ? userVotes.some((vote: any) => {
        const votedBid = augmentedBids.find((b) => b.id === vote.prop_id)
        return votedBid && votedBid.trancheId === bid.trancheId
      })
    : false

  // Determine focus state for CSS variants
  let focusStateClass = ''
  if (isHoveringVoteButton) {
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

  if (!bid) return null

  const bidDescription = bidDescriptionsById[bidId]

  const { projectLogoUrl = '/images/logo-drop.png' } = bidDescription ?? {}

  const environment = getEnvironment()
  const source = getSource(environment, sourceId)
  const voteThreshold =
    source.voteThresholds[bid.trancheId as keyof typeof source.voteThresholds]
  const isBelowVoteThreshold = bid.vote_perc < voteThreshold

  return (
    <div
      id={`bid-card--${sourceId}-${bidId}`}
      tabIndex={0}
      className={twMerge(
        isLoading && 'opacity-75',
        userHasVotedOnThisBid && 'is-voted-on',
        isBelowVoteThreshold && 'is-below-threshold',
        focusStateClass,
        'group/bid-card',
        'grid',
        'relative z-10',
        'outline-none',
        'gap-tight',
        'transition-all',
        'p-tighter',
        'grid-areas-bid-card',
        '[&_.important-value]:text-base',
        'is-below-threshold:theme-color-beige',
        'is-change-vote-focused:theme-color-green',
        'is-vote-focused:theme-color-green',
        'is-voted-on:theme-color-green',
        '@card-is-row:table-row',
        '@card-is-row:grid-cols-none',
        '@card-is-row:grid-rows-none',
        '@card-is-row:gap-0',
        '@card-is-row:p-0',
        className,
      )}
      {...otherProps}
    >
      <TD className="grid-in-logo @card-is-row:h-24">
        <FloatingCardElements
          sourceId={sourceId}
          bidId={bidId}
          isLoading={isLoading}
          isFirstCell={true}
        />
        <BidCardLogo
          projectLogoUrl={projectLogoUrl}
          projectName={bidDescription?.projectName}
          title={bidDescription?.title}
        />
      </TD>

      <TD
        className={twJoin(
          'grid-in-title',
          'px-tighter py-tightest',
          '@card-is-row:w-auto',
        )}
      >
        <FloatingCardElements
          sourceId={sourceId}
          bidId={bidId}
          isLoading={isLoading}
        />
        <h3 className="title">
          <OrphanController disabledInPortrait={false}>
            {bid.title}
          </OrphanController>
        </h3>
      </TD>

      <div
        className={twJoin(
          'grid-in-fields',
          'gap-loose flex items-center justify-between',
          'px-tighter py-tightest',
          '@card-is-row:contents',
        )}
      >
        {bidCardFields.map(({ key, label, value }) => {
          const valueToRender =
            typeof value === 'function' ? value(bid, sourceId) : value

          return (
            <TD key={key} className="@card-is-row:text-center">
              <FloatingCardElements
                sourceId={sourceId}
                bidId={bidId}
                isLoading={isLoading}
              />
              <div
                className={twJoin(
                  'gap-tight flex flex-col',
                  'text-sm',
                  '@card-is-row:items-center',
                )}
              >
                <span className="sr-only">{label}</span>
                {valueToRender}
              </div>
            </TD>
          )
        })}
      </div>

      <TD className={twJoin('grid-in-actions')}>
        <FloatingCardElements
          sourceId={sourceId}
          bidId={bidId}
          isLoading={isLoading}
          isLastCell={true}
        />
        <div
          className={twJoin(
            'h-full',
            'relative z-10',
            'flex items-center justify-center',
            'gap-tightest',
            '*:last:rounded-r-[calc(var(--radius-standard)-var(--spacing-tightest))]',
          )}
        >
          <VoteButton
            bidId={bidId}
            sourceId={sourceId}
            onMouseEnter={() => setIsVoteButtonHovered(true)}
            onMouseLeave={() => setIsVoteButtonHovered(false)}
            onFocus={() => setIsVoteButtonFocused(true)}
            onBlur={() => setIsVoteButtonFocused(false)}
          />

          <button
            type="button"
            className={twMerge(
              'group/action-button',
              'btn h-full rounded-l-none',
              'flex items-center justify-center',
              'px-standard',
              'hover:bg-darkened',
            )}
          >
            <span
              className={twJoin(
                'transition-all',
                'group-hover/action-button:translate-x-1',
              )}
            >
              <Icon name="solid:chevron-right" />
            </span>
          </button>
        </div>
      </TD>
    </div>
  )
}
