'use client'

import { BidBrowser } from '@v2/components/BidBrowser'
import { BidWrapper } from '@v2/components/BidWrapper'
import { SourceID } from '@v2/environments'
import { twJoin } from 'tailwind-merge'

export function BidBrowserModal({
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
        'is-below-threshold:theme-color-beige text-foreground',
        'fixed inset-0 z-20',
        'bg-background/80 backdrop-blur-sm',
        'top-[calc(var(--spacing-bar-height-standard)+var(--spacing-looser))]',
        'desktop:top-[calc(var(--spacing-bar-height-large)+var(--spacing-tight))]',
      )}
    >
      <div
        className={twJoin(
          'h-full',
          'inset-x-loose absolute',
          'rounded-standard',
          'overflow-hidden',
        )}
      >
        <BidBrowser
          sourceId={sourceId}
          bidId={parseInt(bidId)}
          isModal={true}
          className="h-full overflow-hidden"
        />
      </div>
    </BidWrapper>
  )
}
