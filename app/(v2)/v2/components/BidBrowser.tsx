'use client'

import { BidDetails } from '@v2/components/BidDetails'
import { BidNavigation } from '@v2/components/BidNavigation'
import { SourceID } from '@v2/environments'
import { twMerge } from 'tailwind-merge'

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
  return (
    <div
      className={twMerge(
        'relative h-full overflow-hidden',
        'grid grid-rows-[auto]',
        className,
      )}
    >
      <div className="flex h-full flex-col overflow-hidden">
        <BidNavigation bidId={bidId} isModal={isModal} />

        <BidDetails
          sourceId={sourceId}
          bidId={bidId}
          isModal={isModal}
          className="h-full overflow-hidden"
        />
      </div>
    </div>
  )
}
