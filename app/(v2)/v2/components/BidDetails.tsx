'use client'

import { Icon } from '@/components/Icon'
import { MarkdownContainer } from '@/components/MarkdownContainer'
import { useIsMobile } from '@/lib/useIsMobile'
import { Tooltip } from '@v2/components/Tooltip'
import { getEnvironment, getSource, SourceID } from '@v2/environments'
import { useAppState } from '@v2/state/DataProviderOnClient'
import React, { useEffect, useRef } from 'react'
import { twJoin, twMerge } from 'tailwind-merge'
import { BidDuration } from './BidDuration'
import { BidMaxDeployment } from './BidMaxDeployment'
import { BidPolSize } from './BidPolSize'
import { BidTributeApr } from './BidTributeApr'
import { BidVoteShare } from './BidVoteShare'

export function BidDetails({
  sourceId,
  bidId,
  className,
}: {
  sourceId: SourceID
  bidId: number
  className?: string
}) {
  const { state } = useAppState()
  const { currentRoundDataPerSource, bidDescriptionsById } = state
  const source = getSource(getEnvironment(), sourceId)
  const sourceData = currentRoundDataPerSource?.[sourceId]
  const bid = sourceData?.augmentedBids?.find((bid) => bid.id === bidId)
  const isMobile = useIsMobile()
  const sidebarRef = useRef<HTMLElement>(null)
  const mainRef = useRef<HTMLElement>(null)

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

  const voteThreshold = bid?.trancheId
    ? source.voteThresholds[bid.trancheId as keyof typeof source.voteThresholds]
    : null
  const isBelowVoteThreshold =
    bid && voteThreshold ? bid.vote_perc < voteThreshold : false

  const walletData = currentRoundDataPerSource?.[sourceId]?.walletData
  const userVotes = walletData?.votes || []

  const userVotedOnBidIds = userVotes
    .filter((vote: any) => vote.prop_id === bidId)
    .map((vote: any) => vote.prop_id)

  const userHasVotedOnThisBid = userVotedOnBidIds.includes(bidId)

  const bidDescription = bidDescriptionsById[bidId]

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
    <article
      className={twMerge(
        isBelowVoteThreshold && 'is-below-threshold',
        userHasVotedOnThisBid && 'is-voted-on',
        'is-voted-on:theme-color-green',
        'is-below-threshold:theme-color-beige',
        'grid grid-rows-[min-content_auto]',
        'h-full overflow-hidden',
        'relative',
        className,
      )}
    >
      <header
        className={twJoin(
          'h-bar-height-large',
          'flex items-center',
          'px-loosest py-standard',
          'bg-theme-color',
          'is-below-threshold:text-background',
          'is-voted-on:text-background',
        )}
      >
        <h1 className="title">{bidDescription?.title}</h1>
      </header>

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
    </article>
  )
}
