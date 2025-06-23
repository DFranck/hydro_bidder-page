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
    value: (bid: BidRevampMetrics, sourceId: SourceID) => (
      <BidDuration bidId={bid.id} sourceId={sourceId} />
    ),
  },
  {
    key: 'apr',
    label: 'APR',
    value: (bid: BidRevampMetrics, sourceId: SourceID) => (
      <BidTributeApr bidId={bid.id} sourceId={sourceId} />
    ),
  },
  {
    key: 'vote-percentage',
    label: 'Vote %',
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
        '@lg:h-full',
        '@lg:relative',
        '@lg:table-cell',
        '@lg:w-auto',
        '@lg:align-middle',
        '@lg:p-tight',
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
  isHoveringVoteButton,
  isFirstCell = false,
  isLastCell = false,
}: {
  sourceId: SourceID
  bidId: number
  isLoading: boolean
  isHoveringVoteButton: boolean
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
          'hidden @lg:block',
          isFirstCell
            ? [
                'block',
                'rounded-standard',
                '@lg:rounded-none',
                '@lg:rounded-l-standard',
              ]
            : '',
          isLastCell ? 'rounded-r-standard' : '',
          !isFirstCell && !isLastCell ? 'rounded-none' : '',
        )}
        style={{
          ...(isHoveringVoteButton
            ? ({
                '--color-theme-color': 'var(--color-palette-green)',
              } as React.CSSProperties)
            : {}),
        }}
      >
        <div
          className={twMerge(
            'voted-on:block hidden',
            '-inset-tightest absolute',
            'border-theme-color border-(length:--spacing-tightest)',
            'rounded-[calc(var(--radius-standard)+var(--spacing-tightest))]',
            isFirstCell && '@lg:rounded-r-none @lg:border-r-0',
            isLastCell && '@lg:rounded-l-none @lg:border-l-0',
            !(isFirstCell || isLastCell) && '@lg:rounded-none @lg:border-x-0',
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

  // Get wallet data for this source
  const walletData = currentRoundDataPerSource?.[sourceId]?.walletData
  const userVotes = walletData?.votes || []

  // Check if user has voted on this specific bid
  const userVotedOnBidIds = userVotes
    .filter((vote: any) => vote.prop_id === bidId)
    .map((vote: any) => vote.prop_id)

  const userHasVotedOnThisBid = userVotedOnBidIds.includes(bidId)

  const augmentedBids =
    currentRoundDataPerSource?.[sourceId]?.augmentedBids ?? []
  const bid = augmentedBids?.find((bid) => bid.id === bidId)

  // Track VoteButton hover and focus state
  const [isVoteButtonHovered, setIsVoteButtonHovered] = useState(false)
  const [isVoteButtonFocused, setIsVoteButtonFocused] = useState(false)
  const isHoveringVoteButton = isVoteButtonHovered || isVoteButtonFocused

  if (!bid) return null

  const bidDescription = bidDescriptionsById[bidId]

  const { projectLogoUrl = '/images/logo-drop.png' } = bidDescription ?? {}

  // Check if bid is below vote threshold
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
        userHasVotedOnThisBid && 'voted-on',
        isBelowVoteThreshold && 'low-votes',
        'group/bid-card',
        'block',
        'relative z-10',
        'outline-none',
        'gap-tight',
        'transition-all',
        'p-tighter',
        'grid-areas-bid-card',
        'grid grid-cols-[auto_1fr_auto] grid-rows-[auto_auto]',
        '@lg:table-row',
        '@lg:grid-cols-none',
        '@lg:grid-rows-none',
        '@lg:gap-0',
        '@lg:p-0',
        isLoading && 'opacity-75',
        className,
      )}
      style={
        userHasVotedOnThisBid
          ? ({
              '--color-theme-color': 'var(--color-palette-green)',
            } as React.CSSProperties)
          : isBelowVoteThreshold
            ? ({
                '--color-theme-color': 'var(--color-palette-beige)',
              } as React.CSSProperties)
            : undefined
      }
      {...otherProps}
    >
      <TD className="grid-in-logo">
        <FloatingCardElements
          sourceId={sourceId}
          bidId={bidId}
          isLoading={isLoading}
          isHoveringVoteButton={isHoveringVoteButton}
          isFirstCell={true}
        />
        <BidCardLogo
          projectLogoUrl={projectLogoUrl}
          projectName={bidDescription?.projectName}
          title={bidDescription?.title}
        />
      </TD>

      <TD className={twJoin('grid-in-title', 'px-tighter py-tightest')}>
        <FloatingCardElements
          sourceId={sourceId}
          bidId={bidId}
          isLoading={isLoading}
          isHoveringVoteButton={isHoveringVoteButton}
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
          '@lg:contents',
        )}
      >
        {bidCardFields.map(({ key, label, value }) => {
          const valueToRender =
            typeof value === 'function' ? value(bid, sourceId) : value

          return (
            <TD key={key} className="@lg:text-center">
              <FloatingCardElements
                sourceId={sourceId}
                bidId={bidId}
                isLoading={isLoading}
                isHoveringVoteButton={isHoveringVoteButton}
              />
              <div
                className={twJoin(
                  'gap-tight flex flex-col',
                  'text-sm',
                  '@lg:items-center',
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
          isHoveringVoteButton={isHoveringVoteButton}
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
              'btn h-full',
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
