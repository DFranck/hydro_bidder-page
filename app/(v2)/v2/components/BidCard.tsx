'use client'

import { Icon } from '@/components/Icon'
import { OrphanController } from '@/components/OrphanController'
import { BidRevampMetrics } from '@/contract-apis/types'
import { plural } from '@/lib/pluralize'
import { SourceID } from '@v2/environments'
import { useAppState } from '@v2/state/DataProviderOnClient'
import { useState } from 'react'
import { twJoin, twMerge } from 'tailwind-merge'
import { BidCardLogo } from './BidCardLogo'
import { BidVoteShare } from './BidVoteShare'
import { InternalLink } from './InternalLink'
import { VoteButton } from './VoteButton'

export const bidCardFields = [
  {
    key: 'duration',
    label: 'Duration',
    value: (bid: BidRevampMetrics) => bid.duration,
    unit: (bid: BidRevampMetrics) => plural(bid.duration, 'month'),
  },
  {
    key: 'apr',
    label: 'APR',
    value: (bid: BidRevampMetrics) => <span className="opacity-50">-</span>,
    unit: '%',
  },
  {
    key: 'vote-percentage',
    label: 'Vote %',
    value: (bid: BidRevampMetrics) => <BidVoteShare bid={bid} />,
    unit: null,
  },
]

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
  const userVotedOnBidIds: number[] = []
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

  return (
    <div
      id={`bid-card--${sourceId}-${bidId}`}
      tabIndex={0}
      className={twMerge(
        'relative z-10 shrink-0',
        'group overflow-hidden',
        'grid grid-cols-[min-content_auto_min-content]',
        'outline-none',
        'p-tightest',
        'bg-token-color/20 rounded-standard',
        'hover:bg-token-color/40',
        'focus-within:bg-token-color/60!',
        'transition-all',
        isLoading && 'opacity-75',
        className,
      )}
      style={
        isHoveringVoteButton
          ? ({
              '--color-token-color': 'var(--color-palette-green)',
            } as React.CSSProperties)
          : {}
      }
      {...otherProps}
    >
      <div className="absolute inset-0 z-0">
        <InternalLink
          href={`/v2/bids/${sourceId}/${bidId}`}
          className="absolute inset-0 h-full w-full cursor-pointer border-none bg-transparent"
          disabled={isLoading}
        />
      </div>

      <BidCardLogo
        projectLogoUrl={projectLogoUrl}
        projectName={bidDescription?.projectName}
        title={bidDescription?.title}
      />

      <div
        className={twJoin(
          'flex h-full flex-col items-start justify-between',
          'py-standard pl-loose gap-standard',
          'desktop:flex-row',
          'desktop:items-center',
        )}
      >
        <h3 className="title">
          <OrphanController disabledInPortrait={false}>
            {bid.title}
          </OrphanController>
        </h3>

        <div
          className={twJoin(
            'gap-loosest',
            'flex items-center',
            'text-faded text-sm',
            'desktop:gap-looser',
          )}
        >
          {bidCardFields.map(({ key, label, value, unit }) => {
            const valueToRender =
              typeof value === 'function' ? value(bid) : value
            const unitToRender = typeof unit === 'function' ? unit(bid) : unit

            return (
              <div
                id={`bid-card-field--${sourceId}-${bidId}-${key}`}
                key={key}
                className={twJoin(
                  'gap-tight flex flex-col',
                  'desktop:items-center',
                )}
              >
                <span className="sr-only">{label}</span>
                <span className="gap-tight flex items-center">
                  <span className="important-value">{valueToRender}</span>
                  {unitToRender && <span>{unitToRender}</span>}
                </span>
              </div>
            )
          })}
        </div>
      </div>

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
            className,
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
    </div>
  )
}
