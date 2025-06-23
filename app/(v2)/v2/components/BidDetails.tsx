'use client'

import { MarkdownContainer } from '@/components/MarkdownContainer'
import { useIsMobile } from '@/lib/useIsMobile'
import { TokenThemeWrapper } from '@v2/components/TokenThemeWrapper'
import { getEnvironment, getSource, SourceID } from '@v2/environments'
import { useAppState } from '@v2/state/DataProviderOnClient'
import sumBy from 'lodash/sumBy'
import { useEffect, useRef } from 'react'
import { twJoin, twMerge } from 'tailwind-merge'
import { BidDuration } from './BidDuration'
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
  const bid = currentRoundDataPerSource?.[sourceId]?.augmentedBids?.find(
    (bid) => bid.id === bidId,
  )
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

  const bidDescription = bidDescriptionsById[bidId]

  return (
    <TokenThemeWrapper
      as="article"
      sourceId={sourceId}
      className={twMerge(
        isBelowVoteThreshold && 'low-votes',
        'grid grid-rows-[min-content_auto]',
        'h-full overflow-hidden',
        'relative',
        className,
      )}
      style={
        isBelowVoteThreshold
          ? ({
              '--color-theme-color': 'var(--color-palette-beige)',
            } as React.CSSProperties)
          : undefined
      }
    >
      <header
        className={twJoin(
          'h-bar-height-large',
          'flex items-center',
          'px-loosest py-standard',
          'bg-theme-color',
          'low-votes:text-background',
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
          {[
            ['Project Name', bidDescription?.projectName],
            ['Bid in Round', bid.roundId + 1],
            ['Status', bid.status],
            [
              'Duration',
              <BidDuration key="duration" bidId={bid.id} sourceId={sourceId} />,
            ],
            [
              'Vote %',
              <BidVoteShare
                key="vote-share"
                bidId={bid.id}
                sourceId={sourceId}
              />,
            ],
            [
              'Voter APR',
              <BidTributeApr
                key="tribute-apr"
                bidId={bid.id}
                sourceId={sourceId}
              />,
            ],
            [
              'Max Deployment Amount',
              sumBy(
                bid.liquidityDeployment?.deployedFunds,
                'printableAmount',
              )?.toFixed(2) || '–',
            ],
          ].map(([label, value]) => (
            <div
              key={String(label)}
              className={twJoin(
                'gap-tighter flex flex-col',
                'desktop:items-end',
              )}
            >
              <div className="label">{label}</div>
              <div className="important-value">{value}</div>
            </div>
          ))}
        </aside>

        <div className="p-loosest desktop:pr-80 text-balance">
          <MarkdownContainer
            breakThreshold={24}
            content={bidDescription?.description}
          />
        </div>
      </main>
    </TokenThemeWrapper>
  )
}
