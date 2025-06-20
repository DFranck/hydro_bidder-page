'use client'

import { Icon } from '@/components/Icon'
import { MarkdownContainer } from '@/components/MarkdownContainer'
import { BidCard, bidCardFields } from '@v2/components/BidCard'
import { TokenThemeWrapper } from '@v2/components/TokenThemeWrapper'
import { SourceID } from '@v2/environments'
import { useAppState } from '@v2/state/DataProviderOnClient'
import { useEffect, useRef } from 'react'
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
  const userVotedInBucket = false
  const bidsInTranche = allBids.filter((bid) => bid.trancheId === trancheId)

  useEffect(() => {
    const updateLabelPositions = () => {
      const container = document.querySelector(
        `#tranche-content-inner--${sourceId}-${trancheId}`,
      ) as HTMLElement | null

      if (!container) return

      const containerRect = container.getBoundingClientRect()

      bidCardFields.forEach(({ key }) => {
        const labelElement = document.querySelector(
          `#bid-card-field-label--${sourceId}-${trancheId}-${key}`,
        ) as HTMLElement | null
        if (!labelElement) return

        const firstValueElement = document.querySelector(
          [
            `#tranche-content-inner--${sourceId}-${trancheId}`,
            `[id^="bid-card-field--${sourceId}-"][id$="-${key}"]`,
          ].join(' '),
        ) as HTMLElement | null
        if (!firstValueElement) return

        const valueRect = firstValueElement.getBoundingClientRect()

        if (valueRect.left === 0 || containerRect.left === 0) {
          console.warn('Invalid position detected for', key, {
            valueRect,
            containerRect,
          })
          return
        }

        // Get the computed padding of the container
        const containerStyle = window.getComputedStyle(container)
        const containerPaddingLeft = parseFloat(containerStyle.paddingLeft)

        // Calculate center position accounting for padding
        const centerPosition =
          valueRect.left -
          (containerRect.left + containerPaddingLeft) +
          valueRect.width / 2

        labelElement.style.left = `${centerPosition}px`
      })
    }

    const timeoutId = setTimeout(updateLabelPositions, 0)

    const containerResizeObserver = new ResizeObserver(updateLabelPositions)
    const container = document.querySelector(
      `#tranche-content-inner--${sourceId}-${trancheId}`,
    )
    if (container) {
      containerResizeObserver.observe(container)
    }

    const intervalId = setInterval(updateLabelPositions, 500)

    return () => {
      clearTimeout(timeoutId)
      containerResizeObserver.disconnect()
      clearInterval(intervalId)
    }
  }, [bidsInTranche.length, sourceId, trancheId])

  const viewboxClassName = twMerge(
    'rounded-standard absolute inset-0 overflow-hidden',
    'grid grid-rows-[min-content_auto]',
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
          'relative z-10',
          'h-bar-height-standard flex items-center justify-between',
          'px-standard gap-standard',
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
        <div>
          <MarkdownContainer content={metadata} />
        </div>

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
                <span>Voted!</span>
                <Icon name="solid:circle-check" />
              </>
            ) : (
              <>
                <span>Haven&rsquo;t voted</span>
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
            'px-tight',
            'gap-tight',
            'desktop:gap-loose',
            bidsInTranche.length && [
              'py-tight',
              'desktop:py-loose',
              'md:max-w-[70vw]',
            ],
          )}
        >
          {bidsInTranche.length > 0 && (
            <div className="relative h-6 shrink-0">
              {bidCardFields.map(({ key, label }) => (
                <div
                  id={`bid-card-field-label--${sourceId}-${trancheId}-${key}`}
                  key={key}
                  className={twJoin(
                    'label',
                    'absolute',
                    'transition-all duration-200',
                    'whitespace-nowrap',
                    '-translate-x-1/2',
                    'top-1/2 -translate-y-1/2',
                  )}
                >
                  {label}
                </div>
              ))}
            </div>
          )}

          {bidsInTranche.map((bid, index) => {
            return <BidCard key={bid.id} sourceId={sourceId} bidId={bid.id} />
          })}

          {!bidsInTranche.length && (
            <div className="empty-box">
              <span>
                This is a fresh round &ndash; Bids will be posted soon!
              </span>
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
