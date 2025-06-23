'use client'

import { Icon } from '@/components/Icon'
import { MarkdownContainer } from '@/components/MarkdownContainer'
import { Tooltip } from '@/components/Tooltip'
import { voteThresholdTooltip } from '@/components/ToolTips'
import { BidCard, bidCardFields } from '@v2/components/BidCard'
import { TokenThemeWrapper } from '@v2/components/TokenThemeWrapper'
import { SourceID, getEnvironment, getSource } from '@v2/environments'
import { useAppState } from '@v2/state/DataProviderOnClient'
import orderBy from 'lodash/orderBy'
import { useRef } from 'react'
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
      className={twJoin(
        'label whitespace-nowrap',
        '@card-is-row:table-cell',
        '@card-is-row:px-tight',
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
  const allBids = currentRoundDataPerSource?.[sourceId].augmentedBids ?? []

  const bidsInTranche = orderBy(
    allBids.filter((bid) => bid.trancheId === trancheId),
    ['vote_perc'],
    ['desc'],
  )

  const environment = getEnvironment()
  const source = getSource(environment, sourceId)
  const voteThreshold =
    source.voteThresholds[trancheId as keyof typeof source.voteThresholds]

  const viewboxClassName = twMerge(
    'rounded-standard absolute inset-0 overflow-hidden',
    'grid grid-rows-[min-content_auto]',
    'opacity-100 transition-opacity duration-200',
    'voted-within:border-palette-green',
    'voted-within:scrollbar-thumb-palette-green',
    'voted-within:scrollbar-track-transparent',
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
          'transition-colors',
          'bg-gradient-to-b',
          'is-active:from-theme-color',
          'is-active:to-theme-color/50',
          'voted-within:font-black',
        )}
      >
        <MarkdownContainer
          content={description}
          className={twJoin(
            'text-xs text-balance',
            'voted-within:prose-headings:text-background',
            'voted-within:prose-a:text-foreground',
            'voted-within:prose-a:font-black',
            'voted-within:prose-strong:text-background',
            'voted-within:prose-code:text-foreground',
            'voted-within:prose-ol:text-background',
            'voted-within:prose-li:text-background',
            'voted-within:prose-thead:bg-foreground/10',
            'voted-within:[&_a:hover]:text-foreground/70',
            'voted-within:text-background',
            'voted-within:marker:text-background',
          )}
        />

        <div
          className={twJoin(
            'footnote whitespace-nowrap',
            'voted-within:text-background',
          )}
        >
          <div className="voted-within:hidden flex gap-1">
            <span>Haven&rsquo;t voted</span>
            <Icon name="solid:circle-dashed" />
          </div>
          <div className="voted-within:flex hidden gap-1">
            <span>You&rsquo;ve voted!</span>
            <Icon name="solid:circle-check" />
          </div>
        </div>
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
                <div className={twJoin('hidden', '@card-is-row:table-row')}>
                  <TH className="w-24">Logo</TH>
                  <TH className="w-auto">Title</TH>
                  {bidCardFields.map(({ key, label }) => (
                    <TH key={key} className="w-24 text-center">
                      {label}
                    </TH>
                  ))}
                  <TH className="w-24 text-right">Actions</TH>
                </div>
              </div>
              <div
                className={twJoin(
                  'gap-standard flex flex-col',
                  '@card-is-row:table-row-group',
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
                    <>
                      {isFirstBelowThreshold && (
                        <div className="@card-is-row:table-row">
                          <div
                            className={twJoin(
                              '@card-is-row:relative @card-is-row:table-cell',
                              'h-bar-height-standard',
                            )}
                          >
                            <div
                              className={twJoin(
                                'h-full w-[100cqw]',
                                'flex items-center justify-between',
                                'gap-standard',
                                'text-palette-beige text-xs whitespace-nowrap',
                                '@card-is-row:absolute',
                                '@card-is-row:top-1/2',
                                '@card-is-row:-translate-y-1/2',
                              )}
                            >
                              <div className="border-palette-beige w-full border-t-2" />
                              <Tooltip
                                tipContents={voteThresholdTooltip({
                                  trancheId,
                                })}
                              >
                                <div className="gap-tightest flex items-center">
                                  <Icon name="solid:circle-exclamation" />
                                  <span>
                                    These are below the{' '}
                                    <strong className="has-tooltip">
                                      {voteThreshold * 100}% vote share
                                      threshold
                                    </strong>
                                  </span>
                                  <Icon name="circle-info" />
                                </div>
                              </Tooltip>
                              <div className="border-palette-beige w-full border-t-2" />
                            </div>
                          </div>
                        </div>
                      )}
                      <BidCard
                        key={bid.id}
                        sourceId={sourceId}
                        bidId={bid.id}
                      />
                    </>
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
    <TokenThemeWrapper
      sourceId={sourceId}
      id={`tranche-container--${sourceId}-${trancheId}`}
      className={twMerge(
        isActive && 'is-active',
        userVotedInTranche && 'voted-within',
        'relative w-full',
        'h-full shrink-0 grow-0',
        'snap-start',
        'is-active:z-10',
        className,
      )}
      style={
        userVotedInTranche
          ? ({
              '--color-theme-color': 'var(--color-palette-green)',
            } as React.CSSProperties)
          : undefined
      }
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
