import { SourceLabel } from '@/app/(v2)/v2/components/SourceLabel'
import { Icon } from '@/components/Icon'
import { BidCard } from '@v2/components/BidCard'
import { TokenThemeWrapper } from '@v2/components/TokenThemeWrapper'
import { SourceID } from '@v2/environments'
import { useKeyboardNavigation } from '@v2/hooks/useKeyboardNavigation'
import { useAppState } from '@v2/state/provider'
import { useRef } from 'react'
import { twJoin, twMerge } from 'tailwind-merge'

export function Tranche({
  sourceId,
  trancheId,
  isActive,
  className,
  renderViewbox,
  ...otherProps
}: React.ComponentProps<'div'> & {
  sourceId: SourceID
  trancheId: number
  renderViewbox?: (props: {
    className: string
    children: React.ReactNode
  }) => React.ReactNode
  isActive?: boolean
}) {
  const { state } = useAppState()
  const { narrowBuckets, currentRoundDataPerSource } = state
  const tranche = currentRoundDataPerSource?.[sourceId].tranches.find(
    (tranche) => tranche.id === trancheId,
  )
  const viewboxRef = useRef<HTMLDivElement>(null)

  if (!tranche) return null

  const { name, metadata } = tranche
  const allBids = currentRoundDataPerSource?.[sourceId].augmentedBids ?? []
  const userVotedInBucket = false // TODO: add this
  const bidsInTranche = allBids.filter((bid) => bid.trancheId === trancheId)

  useKeyboardNavigation({
    selector: `[id^="bid-card--${sourceId}-"]`,
    direction: 'vertical',
    containerRef: viewboxRef,
    onNavigateToParent: (currentElement) => {
      const currentId = currentElement.id
      const match = currentId.match(/bid-card--(.+)-(\d+)/)
      if (match) {
        const [, sourceId, trancheId] = match
        return document.querySelector(
          `[id="tranche-nav-button--${sourceId}-${trancheId}"]`,
        ) as HTMLElement | null
      }
      return null
    },
  })

  const viewboxClassName = twMerge(
    'rounded-standard absolute inset-0 overflow-hidden',
    'grid grid-rows-[min-content_auto]',
    'gap-standard desktop:gap-loose',
    narrowBuckets && [
      'border-2 border-transparent',
      isActive && 'border-token-color',
    ],
    userVotedInBucket && [
      'border-palette-green',
      'scrollbar-thumb-palette-green',
      'scrollbar-track-transparent',
    ],
    'opacity-100 transition-opacity duration-200',
  )

  const contentContainerClassName = twMerge('h-full', 'overflow-y-auto')

  const viewboxContent = (
    <>
      <div
        id={`tranche-header--${sourceId}-${trancheId}`}
        className={twJoin(
          'flex h-12 items-center justify-between px-3',
          'transition-colors',
          userVotedInBucket
            ? isActive
              ? 'bg-palette-green'
              : 'bg-palette-green/20'
            : isActive
              ? 'bg-token-color'
              : 'bg-token-color/40',
        )}
      >
        <SourceLabel sourceId={sourceId} />

        <div className={twJoin('flex items-center gap-2')}>
          <span
            className={twJoin(
              'footnote',
              'flex items-center gap-1',
              userVotedInBucket && 'text-palette-green',
            )}
          >
            {userVotedInBucket ? (
              <>
                <span>You voted in this tranche</span>
                <Icon name="solid:circle-check" />
              </>
            ) : (
              <>
                <span>You haven&rsquo;t voted in this tranche</span>
                <Icon name="solid:circle-dashed" />
              </>
            )}
          </span>

          <button className={twJoin('btn-icon')}>
            <Icon name="solid:ellipsis-vertical" />
          </button>
        </div>
      </div>

      <div
        id={`tranche-content--${sourceId}-${trancheId}`}
        className={contentContainerClassName}
      >
        <div
          id={`tranche-content-inner--${sourceId}-${trancheId}`}
          className={twJoin(
            'mx-auto flex h-full flex-col',
            'gap-standard desktop:gap-loose',
            bidsInTranche.length && 'md:max-w-[60vw]',
          )}
        >
          {bidsInTranche.map((bid, index) => {
            return <BidCard key={bid.id} sourceId={sourceId} bidId={bid.id} />
          })}

          {!bidsInTranche.length && (
            <div className="empty-box">
              <span>No bids in this tranche, yet&hellip;</span>
            </div>
          )}
        </div>
      </div>
    </>
  )

  return (
    <TokenThemeWrapper
      sourceId={sourceId}
      id={`tranche-container--${sourceId}-${trancheId}`}
      className={twMerge(
        'relative',
        'h-full shrink-0 grow-0',
        'snap-start',
        narrowBuckets ? 'w-[550px]' : 'w-full',
        isActive && 'z-10',
        className,
      )}
      {...otherProps}
    >
      {renderViewbox ? (
        renderViewbox({
          className: viewboxClassName,
          children: viewboxContent,
        })
      ) : (
        <div
          ref={viewboxRef}
          id={`tranche-viewbox--${sourceId}-${trancheId}`}
          tabIndex={0}
          className={viewboxClassName}
        >
          {viewboxContent}
        </div>
      )}
    </TokenThemeWrapper>
  )
}
