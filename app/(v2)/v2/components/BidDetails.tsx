'use client'

import { VoteButton } from '@/app/(v2)/v2/components/VoteButton'
import { Icon } from '@/components/Icon'
import { MarkdownContainer } from '@/components/MarkdownContainer'
import { Tooltip } from '@/components/Tooltip'
import { useIsMobile } from '@/lib/useIsMobile'
import { SourceID } from '@v2/environments'
import { useAppState } from '@v2/state/DataProviderOnClient'
import React, { useEffect, useRef } from 'react'
import { twJoin, twMerge } from 'tailwind-merge'
import { BidDetailsNavigation } from './BidDetailsNavigation'
import { BidDuration } from './BidDuration'
import { BidLogo } from './BidLogo'
import { BidMaxDeployment } from './BidMaxDeployment'
import { BidPolSize } from './BidPolSize'
import { BidTributeApr } from './BidTributeApr'
import { BidVoteShare } from './BidVoteShare'
import { BidWrapper } from './BidWrapper'

export function BidDetails({
  sourceId,
  bidId,
  className,
  isModal = false,
}: {
  sourceId: SourceID
  bidId: number
  className?: string
  isModal?: boolean
}) {
  const { state } = useAppState()
  const { currentRoundDataPerSource, bidDescriptionsById } = state
  const currentRoundData = currentRoundDataPerSource?.[sourceId]
  const { augmentedBids } = currentRoundData ?? {}

  const bid = augmentedBids?.find((bid) => bid.id === bidId)

  const mainRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)

  const isMobile = useIsMobile()

  useEffect(() => {
    const main = mainRef.current
    const sidebar = sidebarRef.current

    if (!main || !sidebar || isMobile) return

    const handleScroll = () => {
      sidebar.style.transform = `translateY(${main.scrollTop}px)`
    }

    main.addEventListener('scroll', handleScroll)
    return () => main.removeEventListener('scroll', handleScroll)
  }, [isMobile])

  if (!bid) return null

  const bidDescription = bidDescriptionsById[bidId]
  const { projectLogoUrl = '/images/logo-drop.png' } = bidDescription ?? {}

  const isOngoing = bid.status?.toLowerCase().includes('ongoing')
  const isCompleted = bid.status?.toLowerCase().includes('completed')
  const hasLiquidityDeployment = (bid.liquidityDeployment?.totalRounds ?? 0) > 0

  const tooltipContent = (content: string) => (
    <div className="flex flex-col gap-2">
      <p className="text-sm">{content}</p>
    </div>
  )

  const sidebarFields = [
    // No tooltip for basic fields
    { label: 'Project Name', value: bidDescription?.projectName },
    { label: 'Bid in Round', value: bid.roundId + 1 },

    // Amount - only show if has liquidity deployment
    ...(hasLiquidityDeployment
      ? [
          {
            label: 'Amount',
            value: <BidPolSize bidId={bid.id} sourceId={sourceId} />,
            tooltip: 'Total amount of liquidity deployed for this bid.',
          },
        ]
      : []),

    {
      label: 'Status',
      value: <span className="capitalize">{bid.status}</span>,
      tooltip: 'Current status of this bid in the protocol.',
    },

    // Duration - only show for ongoing/completed bids
    ...(isOngoing || isCompleted
      ? [
          {
            label: 'Duration',
            value: <BidDuration bidId={bid.id} sourceId={sourceId} />,
            tooltip:
              'Length of time tokens will be locked when voting for this bid.',
          },
        ]
      : []),

    {
      label: 'Vote %',
      value: <BidVoteShare bidId={bid.id} sourceId={sourceId} />,
      tooltip: 'Percentage of total voting power received by this bid.',
    },

    {
      label: 'Voter APR',
      value: <BidTributeApr bidId={bid.id} sourceId={sourceId} />,
      tooltip:
        'Annual percentage return voters can expect from tribute rewards.',
    },

    // Max Deployment Amount - conditionally rendered by the component itself
    {
      label: 'Max Deployment',
      value: <BidMaxDeployment bidId={bid.id} sourceId={sourceId} />,
      tooltip:
        'Estimated maximum amount that could be deployed based on tribute value and minimum tribute factor.',
    },
  ].filter((field) => field.value !== null && field.value !== undefined)

  return (
    <BidWrapper
      as="div"
      sourceId={sourceId}
      bidId={bidId}
      className={twMerge(
        'grid grid-rows-[min-content_min-content_1fr]',
        'h-full overflow-hidden',
        'relative',
        'is-voted-on:theme-color-green',
        'is-below-threshold:theme-color-beige',
        'is-vote-focused:theme-color-green',
        'is-change-vote-focused:theme-color-green',
        className,
      )}
    >
      <BidDetailsNavigation
        sourceId={sourceId}
        bidId={bidId}
        isModal={isModal}
      />

      <div
        className={twJoin(
          'min-h-bar-height-large',
          'grid grid-cols-[min-content_auto_min-content]',
          'bg-theme-color',
          'is-below-threshold:text-background',
          'is-voted-on:text-background',
        )}
      >
        <div className="w-bar-height-large relative h-full">
          <BidLogo
            projectLogoUrl={projectLogoUrl}
            projectName={bidDescription?.projectName}
            title={bidDescription?.title}
            className={twJoin(
              'inset-tighter absolute overflow-hidden',
              'rounded-tl-[calc(var(--radius-standard)-var(--spacing-tightest))]',
            )}
          />
        </div>
        <h1
          className={twJoin(
            'title',
            'px-loose py-standard',
            'flex items-center',
            'is-vote-focused:text-background',
            'is-change-vote-focused:text-background',
          )}
        >
          {bidDescription?.title}
        </h1>
        <div className="flex h-full items-center">
          <VoteButton bidId={bidId} sourceId={sourceId} />
        </div>
      </div>

      <main ref={mainRef} className="relative min-h-0 overflow-y-auto">
        <aside
          ref={sidebarRef}
          className={twJoin(
            'bg-theme-color/20',
            'grid grid-cols-2',
            'px-loosest',
            'py-looser',
            'gap-x-loosest',
            'gap-y-looser',
            'transition-all ease-out',
            'desktop:absolute',
            'desktop:grid-cols-1',
            'desktop:top-loosest',
            'desktop:right-loosest',
            'desktop:w-64',
            'desktop:p-loose',
            'desktop:gap-loosest',
            'desktop:rounded-standard',
            'desktop:max-h-[calc(100%-var(--spacing-loosest)*2)]',
            'desktop:overflow-y-auto',
          )}
        >
          {sidebarFields.map((field, index) => {
            const content = (
              <div
                className={twJoin(
                  'gap-tighter flex flex-col',
                  'desktop:items-end',
                )}
              >
                <div
                  className={twJoin(
                    'w-full',
                    'label flex items-center gap-1',
                    'desktop:justify-end',
                    field.tooltip && [
                      'desktop:flex-row-reverse',
                      'desktop:justify-start',
                    ],
                  )}
                >
                  <span>{field.label}</span>
                  {field.tooltip && (
                    <Icon name="circle-info" className="text-xs opacity-60" />
                  )}
                </div>
                <div className="important-value">{field.value}</div>
              </div>
            )

            return field.tooltip ? (
              <Tooltip
                key={String(field.label)}
                tipContents={tooltipContent(field.tooltip)}
                className="has-tooltip relative z-20 w-full"
              >
                {content}
              </Tooltip>
            ) : (
              <React.Fragment key={String(field.label)}>
                {content}
              </React.Fragment>
            )
          })}
        </aside>

        <div className="p-loosest desktop:pr-80 text-balance">
          <MarkdownContainer
            breakThreshold={24}
            content={bidDescription?.description}
          />
        </div>
      </main>
    </BidWrapper>
  )
}
