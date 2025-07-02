'use client'

import { BidDetails } from '@v2/components/BidDetails'
import { BidWrapper } from '@v2/components/BidWrapper'
import { SourceID } from '@v2/environments'
import { twJoin } from 'tailwind-merge'

export function BidDetailsModal({
  sourceId,
  bidId,
}: {
  sourceId: SourceID
  bidId: string
}) {
  return (
    <BidWrapper
      as="div"
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
        <BidDetails
          sourceId={sourceId}
          bidId={parseInt(bidId)}
          isModal={true}
        />
      </div>
    </BidWrapper>
  )
}
