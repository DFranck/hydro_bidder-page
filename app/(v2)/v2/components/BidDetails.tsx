'use client'

import { Icon } from '@/components/Icon'
import { MarkdownContainer } from '@/components/MarkdownContainer'
import { BidDuration } from '@v2/components/BidDuration'
import { BidLogo } from '@v2/components/BidLogo'
import { BidMaxDeployment } from '@v2/components/BidMaxDeployment'
import { BidPolSize } from '@v2/components/BidPolSize'
import { BidTributeApr } from '@v2/components/BidTributeApr'
import { BidVoteShare } from '@v2/components/BidVoteShare'
import { BidWrapper } from '@v2/components/BidWrapper'
import { useInternalLink } from '@v2/components/InternalLink'
import { Tooltip } from '@v2/components/Tooltip'
import { VoteButton } from '@v2/components/VoteButton'
import { SourceID } from '@v2/environments'
import { useAppState } from '@v2/state/DataProviderOnClient'
import React from 'react'
import { twJoin, twMerge } from 'tailwind-merge'

export function BidDetails({
  sourceId,
  bidId,
  className,
  isModal = false,
  slotBeforeActions,
  slotAfterActions,
}: {
  sourceId: SourceID
  bidId: number
  className?: string
  isModal?: boolean
  slotBeforeActions?: React.ReactNode
  slotAfterActions?: React.ReactNode
}) {
  const { state } = useAppState()
  const { currentRoundDataPerSource, bidDescriptionsById } = state
  const currentRoundData = currentRoundDataPerSource?.[sourceId]
  const { augmentedBids } = currentRoundData ?? {}

  const { navigate } = useInternalLink()
  const bid = augmentedBids?.find((bid) => bid.id === bidId)

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
        'grid grid-rows-[min-content_1fr]',
        'h-full overflow-hidden',
        'gap-tight',
        'relative',
        'is-voted-on:theme-color-green',
        'is-below-threshold:theme-color-beige',
        'is-vote-focused:theme-color-green',
        'is-change-vote-focused:theme-color-green',
        className,
      )}
    >
      <div
        className={twJoin(
          'min-h-bar-height-large',
          'flex items-center justify-between',
          'bg-theme-color',
          'is-below-threshold:text-background',
          'is-voted-on:text-background',
        )}
      >
        <h1
          className={twJoin(
            'title',
            'px-loosest',
            'flex items-center',
            'is-vote-focused:text-background',
            'is-change-vote-focused:text-background',
          )}
        >
          {bidDescription?.title}
        </h1>

        <div className="gap-tight flex h-full items-center">
          {slotBeforeActions}
          <VoteButton bidId={bidId} sourceId={sourceId} />
          {slotAfterActions}
          {!slotAfterActions &&
            (isModal ? (
              <button
                className="btn-icon"
                onClick={() => window.history.back()}
              >
                <Icon name="solid:xmark" />
              </button>
            ) : (
              <Tooltip tipContents={<div>Back to bids</div>}>
                <button className="btn-icon" onClick={() => navigate('/v2')}>
                  <Icon name="solid:list-ul" />
                </button>
              </Tooltip>
            ))}
        </div>
      </div>

      <div
        className={twJoin(
          'min-h-0',
          'grid',
          'grid-rows-[min-content_auto]',
          'gap-tight',
          'desktop:grid-rows-1',
          'desktop:grid-cols-[3fr_1fr]',
        )}
      >
        <div
          className={twJoin(
            'text-balance',
            'py-loose px-loosest',
            'overflow-y-auto',
          )}
        >
          <MarkdownContainer
            breakThreshold={24}
            content={bidDescription?.description}
          />
        </div>

        <aside
          className={twJoin(
            'bg-theme-color/20',
            'grid grid-cols-2',
            'px-loosest',
            'py-looser',
            'gap-x-loosest',
            'gap-y-looser',
            'desktop:h-full',
            'desktop:flex',
            'desktop:flex-col',
            'desktop:p-0',
            'desktop:gap-0',
            'desktop:overflow-y-auto',
          )}
        >
          <div className="h-bar-height-large relative">
            <BidLogo
              projectLogoUrl={projectLogoUrl}
              projectName={bidDescription?.projectName}
              title={bidDescription?.title}
              className="absolute inset-0"
            />
          </div>

          {sidebarFields.map((field, index) => {
            const content = (
              <div
                className={twJoin(
                  'flex flex-col',
                  'gap-tighter',
                  'px-loosest',
                  'py-looser',
                  'desktop:items-end',
                  index % 2 === 0 && 'bg-darkened',
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
                  <span className={twJoin(field.tooltip && 'has-tooltip')}>
                    {field.label}
                  </span>
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
                className="relative z-20 w-full"
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
      </div>
    </BidWrapper>
  )
}
