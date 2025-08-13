'use client'

import { ConditionalWrapper } from '@/components/ConditionalWrapper'
import { Icon } from '@/components/Icon'
import { MarkdownContainer } from '@/components/MarkdownContainer'
import {
  bidDetailsPolSizeTooltip,
  bidDetailsStatusTooltip,
  bidDetailsVoteReceivedTooltip,
  liveBidTributeAprColumnTooltip,
  metricsDurationColumnTooltip,
  metricsTributeColumnTooltip,
  pastBidTributeAprBidsPageColumnTooltip,
} from '@/components/ToolTips'
import { formatAmount } from '@/lib/formatAmount'
import { BidDuration } from '@v2/components/BidDuration'
import { BidLogo } from '@v2/components/BidLogo'
import { BidPolSize } from '@v2/components/BidPolSize'
import { BidTributeApr } from '@v2/components/BidTributeApr'
import { BidVoteShare } from '@v2/components/BidVoteShare'
import { BidWrapper } from '@v2/components/BidWrapper'
import { StickyAwareBox } from '@v2/components/StickyAwareBox'
import { Tooltipped } from '@v2/components/Tooltipped'
import { VoteButton } from '@v2/components/VoteButton'
import { SourceID } from '@v2/environments'
import { useAppState } from '@v2/state/DataProviderOnClient'
import { sumBy } from 'lodash'
import Link from 'next/link'
import React from 'react'
import { twJoin, twMerge } from 'tailwind-merge'

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
  const currentRoundData = currentRoundDataPerSource?.[sourceId]
  const { augmentedBids, currentRoundId } = currentRoundData ?? {}

  const bid = augmentedBids?.find((bid) => bid.id === bidId)

  if (!bid) return null

  const bidDescription = bidDescriptionsById[bidId]
  const { projectLogoUrl = '/images/logo-drop.png' } = bidDescription ?? {}

  const isOngoing = bid.status?.toLowerCase().includes('ongoing')
  const isCompleted = bid.status?.toLowerCase().includes('completed')
  const hasLiquidityDeployment = (bid.liquidityDeployment?.totalRounds ?? 0) > 0
  const totalPowerInRound = sumBy(augmentedBids, 'power')
  const isTokenBased = !bid.points || bid.points.length === 0

  const votingStats = {
    bidPower: formatAmount(bid.power, 6, 0),
    totalPower: formatAmount(totalPowerInRound, 6, 0),
    percentage: formatAmount(bid.vote_perc * 100, 0, 2),
  }

  const sidebarFields = [
    // No tooltip for basic fields
    { label: 'Bid in Round', value: bid.roundId + 1 },

    // Amount - only show if has liquidity deployment
    ...(hasLiquidityDeployment
      ? [
          {
            label: 'Amount',
            value: <BidPolSize bidId={bid.id} sourceId={sourceId} />,
            tooltip: bidDetailsPolSizeTooltip,
          },
        ]
      : []),

    {
      label: 'Status',
      value: <span className="capitalize">{bid.status}</span>,
      tooltip: bidDetailsStatusTooltip,
    },

    // Duration - only show for ongoing/completed bids
    ...(isOngoing || isCompleted
      ? [
          {
            label: 'Duration',
            value: <BidDuration bidId={bid.id} sourceId={sourceId} />,
            tooltip: metricsDurationColumnTooltip,
          },
        ]
      : []),

    {
      label: 'Vote %',
      value: <BidVoteShare bidId={bid.id} sourceId={sourceId} />,
      tooltip: bidDetailsVoteReceivedTooltip(votingStats),
    },

    {
      label: 'Voter APR',
      value: <BidTributeApr bidId={bid.id} sourceId={sourceId} />,
      tooltip: !isTokenBased
        ? metricsTributeColumnTooltip
        : bid.roundId === currentRoundId
          ? liveBidTributeAprColumnTooltip
          : pastBidTributeAprBidsPageColumnTooltip,
    },

    // Max Deployment Amount - conditionally rendered by the component itself
    // hidden on main currently
    // {
    //   label: 'Max Deployment',
    //   value: <BidMaxDeployment bidId={bid.id} sourceId={sourceId} />,
    //   tooltip:
    //     'Estimated maximum amount that could be deployed based on tribute value and minimum tribute factor.',
    // },
  ].filter((field) => field.value !== null && field.value !== undefined)

  return (
    <BidWrapper
      as="div"
      sourceId={sourceId}
      bidId={bidId}
      className={twMerge(
        'grid grid-cols-1 grid-rows-[min-content_1fr]',
        'h-full overflow-hidden',
        'relative',
        'gap-tight',
        'overflow-y-auto',
        'desktop:overflow-hidden',
        'desktop:grid-cols-[5fr_3fr]',
        'is-voted-on:theme-color-green',
        'is-below-threshold:theme-color-beige',
        'is-vote-focused:theme-color-green',
        'is-change-vote-focused:theme-color-green',
        className,
      )}
    >
      <header
        className={twJoin(
          'relative',
          'flex items-center justify-between',
          'px-loose',
          'pt-bar-height-large',
          'pb-loose',
          'bg-background',
        )}
      >
        <div className="gap-tight relative z-10 flex flex-col">
          <h1 className="title-1">{bidDescription?.title}</h1>
          <h2 className="label">
            <ConditionalWrapper
              condition={!!bidDescription?.projectUrl}
              wrapper={(children) => (
                <Link
                  href={bidDescription.projectUrl}
                  target="_blank"
                  className="group/link gap-tightest inline-flex items-center"
                >
                  <span
                    className={twJoin(
                      'link h-min',
                      'group-hover/link:text-palette-beige',
                    )}
                  >
                    {children}
                  </span>
                  <Icon
                    name="arrow-up-right"
                    className={twJoin(
                      'link h-min',
                      'text-xs no-underline',
                      'transition-transform',
                      'group-hover/link:text-palette-beige',
                      'group-hover/link:scale-110',
                      'group-hover/link:translate-x-1',
                    )}
                  />
                </Link>
              )}
            >
              {bidDescription?.projectName}
            </ConditionalWrapper>
          </h2>
        </div>

        <VoteButton
          bidId={bidId}
          sourceId={sourceId}
          className="relative z-10"
        />

        <BidLogo
          projectLogoUrl={projectLogoUrl}
          projectName={bidDescription?.projectName}
          title={bidDescription?.title}
          className="absolute inset-0"
          classNameForClearLogoContainer={twJoin(
            'inset-x-loose top-loose bottom-auto',
            'justify-start',
          )}
        />

        {/* Black gradient to ensure text is legible on logo */}
        <div
          className={twJoin(
            'absolute inset-x-0 bottom-0 h-3/4',
            'from-background bg-linear-to-t to-transparent',
          )}
        />

        {/* Green glow on vote button hover */}
        <div
          className={twJoin(
            'absolute inset-x-0 bottom-0 h-1/2',
            'from-theme-color/20 bg-linear-to-t to-transparent',
            'opacity-0 transition-all',
            'is-vote-focused:opacity-100',
          )}
        />
      </header>

      <div
        className={twJoin(
          'overflow-y-auto',
          'desktop:contents',
          'desktop:overflow-hidden',
        )}
      >
        <aside
          className={twJoin(
            '@container/sidebar',
            'transition-all',
            'relative',
            'transition-all',
            'col-start-1 col-end-2',
            'row-start-1 row-end-2',
            'from-theme-color/20 bg-linear-to-b to-transparent',
            'text-foreground',
            'flex',
            'flex-wrap',
            'content-start',
            'desktop:h-full',
            'desktop:flex',
            'desktop:flex-wrap',
            'desktop:p-0',
            'desktop:gap-0',
            'desktop:overflow-y-auto',
            'desktop:col-start-2',
            'desktop:col-end-3',
            'desktop:row-start-1',
            'desktop:row-end-3',
            'desktop:**:shrink-0',
          )}
        >
          {sidebarFields.map((field) => {
            const containerClassName = twJoin(
              'flex flex-col',
              'gap-tighter',
              'py-standard',
              'items-start',
              'justify-center',
              '[&:nth-child(4n+2)]:bg-darkened',
              '[&:nth-child(4n+3)]:bg-darkened',
              'desktop:px-loose',
              'desktop:basis-1/2',
              'desktop:items-center',
              'desktop:text-center',
            )

            const content = (
              <React.Fragment>
                <div
                  className={twJoin(
                    'w-full',
                    'label flex items-center gap-1',
                    'desktop:justify-center',
                  )}
                >
                  <span className={twJoin(field.tooltip && 'has-tooltip')}>
                    {field.label}
                  </span>
                  {field.tooltip && (
                    <Icon name="circle-info" className="text-xs opacity-60" />
                  )}
                </div>
              </React.Fragment>
            )

            return field.tooltip ? (
              <div className={containerClassName}>
                <Tooltipped key={String(field.label)} tip={field.tooltip}>
                  {content}
                </Tooltipped>
                <div className="important-value">{field.value}</div>
              </div>
            ) : (
              <div className={containerClassName} key={String(field.label)}>
                {content}
                <div className="important-value">{field.value}</div>
              </div>
            )
          })}
        </aside>

        <main
          className={twJoin(
            'col-start-1 col-end-2',
            'row-start-2 row-end-3',
            'text-balance',
            'md:px-loose px-0',
            'pb-loosest',
            'gap-standard flex flex-col',
            'desktop:overflow-y-auto',
            'desktop:row-start-2',
            'desktop:row-end-3',
          )}
        >
          {[
            {
              label: 'About the Project',
              content: bidDescription?.aboutProject,
            },
            {
              label: 'Bid Description',
              content: bidDescription?.description,
            },
            {
              label: 'Committee Review',
              content: bidDescription?.committeeComments,
            },
          ].map(({ label, content }) => (
            <React.Fragment key={label}>
              <StickyAwareBox className="top-0">
                <div
                  className={twJoin(
                    'h-bar-height-standard',
                    'relative',
                    'flex items-center',
                    'label text-palette-beige',
                    'bg-background',
                    'is-stuck:before:absolute',
                    'is-stuck:before:inset-0',
                    'is-stuck:before:bg-theme-color/10',
                  )}
                >
                  {label}
                </div>
              </StickyAwareBox>
              <MarkdownContainer breakThreshold={24} content={content} />
            </React.Fragment>
          ))}
        </main>
      </div>
    </BidWrapper>
  )
}