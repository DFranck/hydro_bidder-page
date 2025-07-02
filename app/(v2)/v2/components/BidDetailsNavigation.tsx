'use client'

import { AugmentedBidWithVoteData } from '@/app/(v2)/v2/types'
import { Icon } from '@/components/Icon'
import { BidWrapper } from '@v2/components/BidWrapper'
import { SourceID } from '@v2/environments'
import { sortBidsInTranche } from '@v2/lib/sortBidsInTranche'
import { useAppState } from '@v2/state/DataProviderOnClient'
import { twJoin, twMerge } from 'tailwind-merge'
import { InternalLink, useInternalLink } from './InternalLink'

export function BidDetailsNavigation({
  sourceId,
  bidId,
  isModal = false,
  className,
}: {
  sourceId: SourceID
  bidId: number
  isModal?: boolean
  className?: string
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

  const navigateToBid = (targetBidId: number) => {
    navigate(`/v2/bids/${sourceId}/${targetBidId}`)
  }

  const handleBackOrClose = () => {
    navigate('/v2')
  }

  return (
    <div
      className={twMerge(
        twJoin(
          'h-bar-height-standard',
          'flex items-center justify-between',
          !isModal && 'flex-row-reverse',
          'px-standard',
          'bg-theme-color/50',
          'desktop:absolute desktop:top-0 desktop:right-0 desktop:z-10',
          'desktop:px-0',
        ),
        className,
      )}
    >
      <div className="flex items-center">
        <button
          className={twJoin(
            'btn label',
            'flex-row-reverse',
            !previousBidInTranche && 'opacity-50',
          )}
          onClick={
            previousBidInTranche
              ? () => navigateToBid(previousBidInTranche.id)
              : undefined
          }
          disabled={!previousBidInTranche}
        >
          <span className="desktop:visible hidden">Previous</span>
          <Icon name="solid:chevron-left" />
        </button>

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
                  'is-below-threshold:text-palette-beige',
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

        <button
          className={twJoin('btn label', !nextBidInTranche && 'opacity-50')}
          onClick={
            nextBidInTranche
              ? () => navigateToBid(nextBidInTranche.id)
              : undefined
          }
          disabled={!nextBidInTranche}
        >
          <span className="desktop:visible hidden">Next</span>
          <Icon name="solid:chevron-right" />
        </button>
      </div>

      <button className="btn label" onClick={handleBackOrClose}>
        {isModal ? (
          <>
            <span>Close</span>
            <Icon name="solid:xmark" />
          </>
        ) : (
          <>
            <Icon name="solid:chevron-left" />
            <span>Bids</span>
          </>
        )}
      </button>
    </div>
  )
}
