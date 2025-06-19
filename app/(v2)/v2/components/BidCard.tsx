'use client'

import { Icon } from '@/components/Icon'
import { OrphanController } from '@/components/OrphanController'
import { BidRevampMetrics } from '@/contract-apis/types'
import { plural } from '@/lib/pluralize'
import { SourceID } from '@v2/environments'
import { useAppState } from '@v2/state/ClientDataProvider'
import Link from 'next/link'
import { useRef } from 'react'
import { twJoin, twMerge } from 'tailwind-merge'
import { useHover } from 'usehooks-ts'
import { BidCardLogo } from './BidCardLogo'

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
    value: (bid: BidRevampMetrics) => bid.vote_perc,
    unit: '%',
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
  const { currentRoundDataPerSource, bidDescriptionsById } = state
  const voteButtonRef = useRef<HTMLDivElement | null>(null)
  const isHoveringVoteButton = useHover(
    voteButtonRef as React.RefObject<HTMLDivElement>,
  )
  const userVotedOnBidIds: number[] = []
  const userHasVotedOnThisBid = userVotedOnBidIds.includes(bidId)
  const augmentedBids =
    currentRoundDataPerSource?.[sourceId]?.augmentedBids ?? []
  const bid = augmentedBids?.find((bid) => bid.id === bidId)

  if (!bid) return null

  const bidDescription = bidDescriptionsById[bidId]

  const { projectLogoUrl = '/images/logo-drop.png' } = bidDescription ?? {}

  return (
    <div
      id={`bid-card--${sourceId}-${bidId}`}
      tabIndex={0}
      className={twMerge(
        'relative z-10',
        'group overflow-hidden',
        'grid grid-cols-[min-content_auto_min-content]',
        'outline-none',
        'p-tightest',
        'bg-token-color/20 rounded-standard',
        'hover:bg-token-color/40',
        'focus-within:bg-token-color/60!',
        'transition-all',
        isHoveringVoteButton && 'duration-700',
        className,
      )}
      style={
        isHoveringVoteButton
          ? ({
              '--color-token-color': 'var(--color-palette-green)',
            } as React.CSSProperties)
          : undefined
      }
      {...otherProps}
    >
      <div className="absolute inset-0 z-0">
        <Link
          href={`/v2/bids/${sourceId}/${bidId}`}
          className="absolute inset-0"
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
        <div
          role="button"
          tabIndex={0}
          ref={voteButtonRef}
          className={twMerge(
            'vote-button',
            'group/action-button',
            'btn h-full',
            'flex items-center justify-center',
            'transition-all',
            'px-standard',
            className,
          )}
        >
          <span className={twJoin('relative block')}>
            {/* The initial circle icon */}
            <span
              className={twJoin(
                'transition-all',
                'group-hover/action-button:opacity-0',
                'group-hover/action-button:scale-0',
              )}
            >
              <Icon name="solid:circle-dashed" />
            </span>

            {/* A lighter circle icon to enlarge and rotate */}
            <span
              className={twJoin(
                'z-10 transition-all',
                'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                'opacity-0',
                'group-hover/action-button:opacity-100',
                'group-hover/action-button:rotate-180',
                'group-hover/action-button:scale-200',
                'group-hover/action-button:animate-spin',
              )}
            >
              <Icon name="light:circle-dashed" />
            </span>

            <span
              className={twJoin(
                'z-10 transition-all',
                'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                'scale-0 opacity-0',
                'group-hover/action-button:scale-100',
                'group-hover/action-button:opacity-100',
              )}
            >
              <Icon name="solid:check" />
            </span>

            <span
              className={twJoin(
                'pointer-events-none z-0 size-12',
                'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                'transition-all',
                'scale-0 opacity-0',
                'group-hover/action-button:scale-300',
                'group-hover/action-button:opacity-100',
                'bg-radial to-50%',
                'from-palette-green to-transparent',
              )}
            />
          </span>
        </div>

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
