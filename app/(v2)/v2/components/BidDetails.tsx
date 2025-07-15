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
import { Tooltipped } from '@v2/components/Tooltipped'
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
    { label: 'Project Name', value: bidDescription?.projectName },
    { label: 'Bid in Round', value: bid.roundId + 1 },

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
          'pb-standard',
          'bg-background',
        )}
      >
        <h1 className="title-1 relative z-10">{bidDescription?.title}</h1>

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

        <div
          className={twJoin(
            'absolute inset-x-0 bottom-0 h-3/4',
            'from-background bg-linear-to-t to-transparent',
          )}
        />

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
            'col-start-1 col-end-2',
            'row-start-1 row-end-2',
            'bg-theme-color/20',
            'grid grid-cols-2',
            'px-loose',
            'py-standard',
            'gap-x-loose',
            'gap-y-standard',
            'text-foreground',
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
                <div className="important-value">{field.value}</div>
              </React.Fragment>
            )

            return field.tooltip ? (
              <Tooltipped
                key={String(field.label)}
                tip={tooltipContent(field.tooltip)}
                className={containerClassName}
              >
                {content}
              </Tooltipped>
            ) : (
              <div className={containerClassName} key={String(field.label)}>
                {content}
              </div>
            )
          })}
        </aside>

        <main
          className={twJoin(
            'col-start-1 col-end-2',
            'row-start-2 row-end-3',
            'text-balance',
            'px-loose',
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
              <div className="sticky top-0">
                <div
                  className={twJoin(
                    'h-bar-height-standard',
                    'flex items-center',
                    'label text-palette-beige',
                    'bg-background',
                  )}
                >
                  {label}
                </div>
              </div>
              <MarkdownContainer breakThreshold={24} content={content} />
            </React.Fragment>
          ))}
        </main>
      </div>
    </BidWrapper>
  )
}
