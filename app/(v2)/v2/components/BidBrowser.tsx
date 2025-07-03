'use client'

import { Icon } from '@/components/Icon'
import { Tooltip } from '@/components/Tooltip'
import { BidDetails } from '@v2/components/BidDetails'
import { SourceID } from '@v2/environments'
import { useBidThemeColor } from '@v2/hooks'
import { sortBidsInTranche } from '@v2/lib/sortBidsInTranche'
import { useAppState } from '@v2/state/DataProviderOnClient'
import { AugmentedBidWithVoteData } from '@v2/types'
import { twJoin, twMerge } from 'tailwind-merge'
import { BidWrapper } from './BidWrapper'
import { InternalLink, useInternalLink } from './InternalLink'

const classNameForSideButtons = twJoin(
  'btn-essentials',
  'w-bar-height-standard h-bar-height-large',
  'flex items-center justify-center',
  'rounded-standard',
  'transition-all',
)

export function BidBrowser({
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
  const { currentRoundDataPerSource } = state
  const currentRoundData = currentRoundDataPerSource?.[sourceId]
  const { augmentedBids } = currentRoundData ?? {}

  const { navigate } = useInternalLink()

  const currentBid = augmentedBids?.find((bid) => bid.id === bidId)
  const currentTrancheId = currentBid?.trancheId

  const bidsInSameTranche: AugmentedBidWithVoteData[] = sortBidsInTranche(
    augmentedBids?.filter((bid) => bid.trancheId === currentTrancheId) ?? [],
  )

  const currentBidIndex = bidsInSameTranche.findIndex((bid) => bid.id === bidId)

  const previousBidInTranche =
    currentBidIndex > 0 ? bidsInSameTranche[currentBidIndex - 1] : null
  const nextBidInTranche =
    currentBidIndex < bidsInSameTranche.length - 1
      ? bidsInSameTranche[currentBidIndex + 1]
      : null

  // Use the new hook to get theme colors for previous and next bids
  const previousBidThemeColor = useBidThemeColor(
    sourceId,
    previousBidInTranche?.id ?? 0,
  )
  const nextBidThemeColor = useBidThemeColor(
    sourceId,
    nextBidInTranche?.id ?? 0,
  )

  const navigateToBid = (targetBidId: number) => {
    navigate(`/v2/bids/${sourceId}/${targetBidId}`)
  }

  const hasPrevious = !!previousBidInTranche
  const hasNext = !!nextBidInTranche

  return (
    <div
      style={
        {
          '--color-theme-color-previous': previousBidThemeColor,
          '--color-theme-color-next': nextBidThemeColor,
        } as React.CSSProperties
      }
      className={twMerge(
        'relative h-full overflow-hidden',
        'grid grid-rows-[auto]',
        className,
      )}
    >
      {/* Carousel Container with Grid Layout */}
      <div
        className={twJoin(
          'grid h-full',
          'gap-tight',
          'grid-cols-[min-content_auto_min-content]',
          'overflow-hidden',
        )}
      >
        {/* Previous Button */}
        {hasPrevious ? (
          <button
            className={twMerge(
              classNameForSideButtons,
              'bg-theme-color-previous',
              'rounded-r-none',
              'hover:bg-theme-color-previous/90',
            )}
            onClick={() => navigateToBid(previousBidInTranche!.id)}
          >
            <Icon name="solid:chevron-left" />
          </button>
        ) : (
          <div className="w-16" />
        )}

        {/* Content */}
        <BidDetails
          sourceId={sourceId}
          bidId={bidId}
          isModal={isModal}
          className="h-full overflow-hidden"
          slotBeforeActions={
            <div className="gap-x-xs flex items-center">
              {bidsInSameTranche.map((siblingBid, index) => {
                const isActive = index === currentBidIndex

                return (
                  <BidWrapper
                    key={index}
                    as="div"
                    sourceId={sourceId}
                    bidId={siblingBid.id}
                    className={twJoin(
                      isActive && 'is-active',
                      'relative size-5',
                      'transition-all',
                      'opacity-20',
                      'is-active:opacity-100',
                      'is-voted-on:text-palette-green',
                    )}
                  >
                    <InternalLink
                      href={`/v2/bids/${sourceId}/${siblingBid.id}`}
                      className="absolute inset-0"
                    >
                      <Icon
                        name={
                          siblingBid.voteButtonData?.hasVotedForThisBid
                            ? 'solid:circle-check'
                            : isActive
                              ? 'solid:circle'
                              : 'regular:circle'
                        }
                        className="centered"
                      />
                    </InternalLink>
                  </BidWrapper>
                )
              })}
            </div>
          }
          slotAfterActions={
            isModal ? (
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
            )
          }
        />

        {/* Next Button */}
        {hasNext ? (
          <button
            className={twMerge(
              classNameForSideButtons,
              'bg-theme-color-next',
              'rounded-l-none',
              'hover:bg-theme-color-next/90',
            )}
            onClick={() => navigateToBid(nextBidInTranche!.id)}
          >
            <Icon name="solid:chevron-right" />
          </button>
        ) : (
          <div className="w-16" />
        )}
      </div>
    </div>
  )
}
