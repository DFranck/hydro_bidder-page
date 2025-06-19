'use client'

import { Icon } from '@/components/Icon'
import { IconString } from '@/components/Icon/types'
import { BidDetails } from '@v2/components/BidDetails'
import { useInternalLink } from '@v2/components/InternalLink'
import { TokenThemeWrapper } from '@v2/components/TokenThemeWrapper'
import { SourceID } from '@v2/environments'
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

  // Find current bid and its tranche
  const currentBid = augmentedBids?.find((bid) => bid.id === parseInt(bidId))
  const currentTrancheId = currentBid?.trancheId

  // Find all bids in the same tranche, sorted by ID
  const bidsInSameTranche =
    augmentedBids
      ?.filter((bid) => bid.trancheId === currentTrancheId)
      .sort((a, b) => a.id - b.id) ?? []

  // Find current bid index in the tranche
  const currentBidIndex = bidsInSameTranche.findIndex(
    (bid) => bid.id === parseInt(bidId),
  )

  // Find previous and next bids
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
    <TokenThemeWrapper
      sourceId={sourceId}
      className={twJoin(
        'fixed inset-0 z-20',
        'top-[calc(var(--spacing-bar-height-standard))]',
        'desktop:top-[calc(var(--spacing-bar-height-large))]',
        'bg-token-color/20 backdrop-blur-sm',
      )}
      onClick={closeModal}
    >
      <div
        className={twJoin(
          'inset-loose fixed',
          'rounded-standard',
          'overflow-hidden',
          'border-background border-4',
          'bg-background',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={twJoin(
            'h-bar-height-standard',
            'flex items-center justify-between',
            'bg-token-color/50',
          )}
        >
          {(
            [
              [
                previousBidInTranche
                  ? () => navigateToBid(previousBidInTranche.id)
                  : closeModal,
                'Previous',
                'solid:chevron-left',
                'flex-row-reverse',
                !previousBidInTranche,
              ],
              [closeModal, 'Close', 'solid:xmark', undefined, false],
              [
                nextBidInTranche
                  ? () => navigateToBid(nextBidInTranche.id)
                  : closeModal,
                'Next',
                'solid:chevron-right',
                undefined,
                !nextBidInTranche,
              ],
            ] as const
          ).map(([onClick, label, icon, className, disabled]) => (
            <button
              key={label}
              className={twJoin(
                'btn label',
                className,
                disabled && 'opacity-50',
              )}
              onClick={onClick}
              disabled={disabled}
            >
              <span>{label}</span>
              <Icon name={icon as IconString} />
            </button>
          ))}
        </div>

        <BidDetails sourceId={sourceId} bidId={parseInt(bidId)} />
      </div>
    </TokenThemeWrapper>
  )
}
