'use client'

import { MarkdownContainer } from '@/components/MarkdownContainer'
import { BidCard, bidCardFields } from '@v2/components/BidCard'
import { VoteStatusIndicator } from '@v2/components/VoteStatusIndicator'
import { VoteThresholdIndicator } from '@v2/components/VoteThresholdIndicator'
import { SourceID, getEnvironment, getSource } from '@v2/environments'
import { useBidsInTranche } from '@v2/hooks/useBidsNavigationOrder'
import { useAppState } from '@v2/state/DataProviderOnClient'
import React, { useRef } from 'react'
import { twJoin, twMerge } from 'tailwind-merge'

function TH({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={twMerge(
        'label py-standard whitespace-nowrap',
        '@card-is-row:table-cell',
        '@card-is-row:px-tight',
        '@card-is-row:py-0',
        className,
      )}
    >
      {children}
    </div>
  )
}

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
  const { currentRoundDataPerSource } = state
  const tranche = currentRoundDataPerSource?.[sourceId].tranches.find(
    (tranche) => tranche.id === trancheId,
  )
  const viewboxRef = useRef<HTMLDivElement>(null)

  const { name, metadata, userVotedInTranche } = tranche ?? {}
  const { logo, description } = JSON.parse(metadata ?? '{}')
  const bidsInTranche = useBidsInTranche(sourceId, trancheId)

  const environment = getEnvironment()
  const source = getSource(environment, sourceId)
  const voteThreshold =
    source.voteThresholds[trancheId as keyof typeof source.voteThresholds]

  const viewboxClassName = twMerge(
    'rounded-standard relative h-full overflow-hidden',
    'grid grid-rows-[min-content_auto]',
    'opacity-100 transition-opacity duration-200',
  )

  const contentContainerClassName = twMerge('h-full', 'overflow-y-auto')

  const viewboxContent = (
    <>
      <div
        id={`tranche-header--${sourceId}-${trancheId}`}
        className={twJoin(
          'relative z-10',
          'h-bar-height-standard',
          'flex items-center justify-between',
          'px-standard gap-standard',
          'font-bold **:font-bold!',
          'transition-colors',
          'from-theme-color bg-linear-to-b to-transparent',
        )}
      >
        <MarkdownContainer
          content={description}
          className={twJoin('text-xs text-balance')}
        />

        <VoteStatusIndicator />

        <div
          className={twJoin(
            'has-voted-within:block hidden',
            'absolute inset-y-0 right-0 left-1/2 z-0',
            'from-palette-green/80 bg-linear-to-l to-transparent',
          )}
        />
      </div>

      <div
        id={`tranche-content--${sourceId}-${trancheId}`}
        className={contentContainerClassName}
      >
        <div
          id={`tranche-content-inner--${sourceId}-${trancheId}`}
          className={twJoin(
            '@container',
            'mx-auto flex h-full flex-col',
            'gap-tight',
            'desktop:gap-loose',
            bidsInTranche.length && [
              'p-tight',
              'desktop:p-loose',
              'md:max-w-[70vw]',
            ],
          )}
        >
          {bidsInTranche.length > 0 ? (
            <div
              className={twJoin(
                'w-full',
                '@card-is-row:table',
                '@card-is-row:table-fixed',
                '@card-is-row:border-separate',
                '@card-is-row:border-spacing-y-standard',
              )}
            >
              <div className="@card-is-row:table-header-group">
                <div
                  className={twJoin(
                    'gap-standard grid w-full',
                    'grid-cols-[auto_auto_auto_calc(var(--spacing)*24)]',
                    '@card-is-row:table-row',
                    '@card-is-row:gap-0',
                  )}
                >
                  <TH className="hidden w-24">Logo</TH>
                  <TH className="hidden w-auto">Title</TH>
                  {bidCardFields.map(({ key, label, className }, index) => (
                    <TH
                      key={`${sourceId}-${trancheId}-${key}`}
                      className={className}
                    >
                      {label}
                    </TH>
                  ))}
                  <TH
                    key={`${sourceId}-${trancheId}-actions`}
                    className={twJoin('text-right', '@card-is-row:w-24')}
                  >
                    Actions
                  </TH>
                </div>
              </div>
              <div
                className={twJoin(
                  'gap-standard flex flex-col',
                  '@card-is-row:table-row-group',
                  '@card-is-row:h-full',
                )}
              >
                {bidsInTranche.map((bid, index) => {
                  const isBelowThreshold = bid.vote_perc < voteThreshold
                  const isFirstBelowThreshold =
                    isBelowThreshold &&
                    bidsInTranche
                      .slice(0, index)
                      .every((prevBid) => prevBid.vote_perc >= voteThreshold)

                  return (
                    <React.Fragment key={bid.id}>
                      {isFirstBelowThreshold && (
                        <VoteThresholdIndicator
                          trancheId={trancheId}
                          voteThreshold={voteThreshold}
                        />
                      )}
                      <BidCard sourceId={sourceId} bidId={bid.id} />
                    </React.Fragment>
                  )
                })}
              </div>
            </div>
          ) : (
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
    <div
      id={`tranche-container--${sourceId}-${trancheId}`}
      data-carousel-section="tranche"
      className={twMerge(
        isActive && 'is-active',
        'relative w-full',
        'h-full shrink-0 grow-0',
        'snap-start',
        'is-active:z-10',
        'overflow-hidden',
        className,
      )}
      data-has-voted-within={userVotedInTranche ? 'true' : undefined}
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
    </div>
  )
}
