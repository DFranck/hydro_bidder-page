'use client'

import { Tooltip } from '@/components/Tooltip'
import { currentRoundNumLiveBidsTooltip } from '@/components/ToolTips'
import { pluralize } from '@/lib/pluralize'
import { useAppState } from '@v2/state/DataProviderOnClient'
import { twJoin } from 'tailwind-merge'

export function CurrentRoundNumberOfBids() {
  const { state } = useAppState()
  const { currentRoundDataPerSource, isLoading } = state

  const bidsInRound = Object.values(currentRoundDataPerSource ?? {}).flatMap(
    (sourceData) => sourceData.augmentedBids ?? [],
  )

  const numPointBasedBids = bidsInRound.filter(
    (bid) => bid.points && bid.points.length > 0,
  ).length

  const tooltipContent = currentRoundNumLiveBidsTooltip({
    numPointBasedBids,
  })

  return (
    <Tooltip tipContents={tooltipContent} className="cursor-help">
      <div className="desktop:gap-3 flex items-center justify-center gap-2">
        <var className="important-value">
          {isLoading ? '...' : bidsInRound.length}
        </var>
        <span
          className={twJoin(
            'has-tooltip',
            'label desktop:text-center desktop:w-auto w-min',
          )}
        >
          Live{' '}
          {pluralize({
            count: bidsInRound.length,
            singular: 'Bid',
          })}
        </span>
      </div>
    </Tooltip>
  )
}
