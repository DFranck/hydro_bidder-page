'use client'

import { Icon } from '@/components/Icon'
import { BidDetails } from '@v2/components/BidDetails'
import { BidWrapper } from '@v2/components/BidWrapper'
import { useInternalLink } from '@v2/components/InternalLink'
import { SourceID } from '@v2/environments'
import { sortBidsInTranche } from '@v2/lib/sortBidsInTranche'
import { useAppState } from '@v2/state/DataProviderOnClient'
import { twJoin } from 'tailwind-merge'

export function BidDetailsModal({
  sourceId,
  bidId,
}: {
  sourceId: SourceID
  bidId: string
}) {
  const { state } = useAppState()
  const { currentRoundDataPerSource } = state
  const currentRoundData = currentRoundDataPerSource?.[sourceId]
  const { augmentedBids } = currentRoundData ?? {}

  const { navigate } = useInternalLink()

  const currentBid = augmentedBids?.find((bid) => bid.id === parseInt(bidId))
  const currentTrancheId = currentBid?.trancheId

  const bidsInSameTranche = sortBidsInTranche(
    augmentedBids?.filter((bid) => bid.trancheId === currentTrancheId) ?? [],
  )

  const currentBidIndex = bidsInSameTranche.findIndex(
    (bid) => bid.id === parseInt(bidId),
  )

  const previousBidInTranche =
    currentBidIndex > 0 ? bidsInSameTranche[currentBidIndex - 1] : null
  const nextBidInTranche =
    currentBidIndex < bidsInSameTranche.length - 1
      ? bidsInSameTranche[currentBidIndex + 1]
      : null

  const closeModal = () => {
    navigate('/v2')
  }

  const navigateToBid = (targetBidId: number) => {
    navigate(`/v2/bids/${sourceId}/${targetBidId}`)
  }

  return (
    <BidWrapper
      sourceId={sourceId}
      bidId={parseInt(bidId)}
      className={twJoin(
        'is-below-threshold:theme-color-beige',
        'fixed inset-0 z-20',
        'bg-theme-color/20 backdrop-blur-sm',
        'top-[calc(var(--spacing-bar-height-standard)+var(--spacing-looser))]',
        'desktop:top-[calc(var(--spacing-bar-height-large)+var(--spacing-tight))]',
      )}
    >
      <div
        className={twJoin(
          'inset-loose absolute',
          'rounded-standard',
          'overflow-hidden',
          'bg-background',
        )}
      >
        <div
          className={twJoin(
            'h-bar-height-large',
            'absolute top-0 right-0 z-10',
            'flex items-center justify-end',
          )}
        >
          <div className="gap-tight flex items-center">
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
              <span>Previous</span>
              <Icon name="solid:chevron-left" />
            </button>

            <div className="gap-x-xs flex items-center">
              {bidsInSameTranche.map((_, index) => (
                <Icon
                  key={index}
                  name={
                    index === currentBidIndex ? 'solid:circle' : 'light:circle'
                  }
                  className="text-xs"
                />
              ))}
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
              <span>Next</span>
              <Icon name="solid:chevron-right" />
            </button>
          </div>

          <button className="btn label" onClick={closeModal}>
            <span>Close</span>
            <Icon name="solid:xmark" />
          </button>
        </div>

        <BidDetails sourceId={sourceId} bidId={parseInt(bidId)} />
      </div>
    </BidWrapper>
  )
}
