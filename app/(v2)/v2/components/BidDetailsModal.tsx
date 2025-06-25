'use client'

import { Icon } from '@/components/Icon'
import { IconString } from '@/components/Icon/types'
import { BidDetails } from '@v2/components/BidDetails'
import { useInternalLink } from '@v2/components/InternalLink'
import { TokenThemeWrapper } from '@v2/components/TokenThemeWrapper'
import { SourceID, getEnvironment, getSource } from '@v2/environments'
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

  const environment = getEnvironment()
  const source = getSource(environment, sourceId)
  const voteThreshold = currentBid?.trancheId
    ? source.voteThresholds[
        currentBid.trancheId as keyof typeof source.voteThresholds
      ]
    : null
  const isBelowVoteThreshold =
    currentBid && voteThreshold ? currentBid.vote_perc < voteThreshold : false

  return (
    <TokenThemeWrapper
      trancheId={currentBid?.trancheId ?? 1}
      className={twJoin(
        isBelowVoteThreshold && 'low-votes',
        'low-votes:theme-color-beige',
        'fixed inset-0 z-20',
        'top-[calc(var(--spacing-bar-height-standard)+var(--spacing-loose))]',
        'desktop:top-[calc(var(--spacing-bar-height-large)+var(--spacing-tight))]',
        'bg-theme-color/20 backdrop-blur-sm',
      )}
      onClick={closeModal}
    >
      <div
        className={twJoin(
          'inset-loose absolute',
          'rounded-standard',
          'overflow-hidden',
          'bg-background',
          'grid grid-rows-[min-content_auto]',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={twJoin(
            'h-bar-height-standard',
            'flex items-center justify-between',
            'bg-theme-color/50',
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
