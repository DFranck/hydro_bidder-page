'use client'

import { polDurationTooltip } from '@/components/ToolTips'
import { BidRevampMetrics } from '@/contract-apis/types'
import { getTimeUnitFromNanos } from '@/lib/getTimeUnitFromNanos'
import { pluralize } from '@/lib/pluralize'
import { Tooltipped } from '@v2/components/Tooltipped'
import { useAppState } from '@v2/state/DataProviderOnClient'
import { SourceID } from '@v2/types'
import { twJoin } from 'tailwind-merge'

interface BidDurationProps {
  bidId: number
  sourceId: SourceID
  className?: string
}

export function BidDuration({ bidId, sourceId, className }: BidDurationProps) {
  const { state } = useAppState()
  const { currentRoundDataPerSource } = state

  const sourceData =
    currentRoundDataPerSource?.[
      sourceId as keyof typeof currentRoundDataPerSource
    ]
  const bid = sourceData?.augmentedBids?.find(
    (bid: BidRevampMetrics) => bid.id === bidId,
  )
  const constants = sourceData?.constants

  if (!bid || !constants) return null

  const isRejected = bid?.status?.toLowerCase().includes('rejected')

  const { value: durationNumber, unit: durationUnit } = getTimeUnitFromNanos(
    bid.duration * constants.lock_epoch_length,
  )

  return isRejected ? null : !durationNumber ? (
    <span className="text-footnote">No data yet</span>
  ) : (
    <Tooltipped
      className={twJoin(
        'has-tooltip',
        'relative z-20',
        'gap-tighter flex items-center',
        className,
      )}
      tip={polDurationTooltip}
      classNamesForTooltip="-translate-y-44"
    >
      <span className="important-value">{durationNumber}</span>{' '}
      {pluralize({
        count: durationNumber,
        singular: durationUnit,
      })}
    </Tooltipped>
  )
}
