'use client'

import { Tooltip } from '@/components/Tooltip'
import { timeLeftTooltip } from '@/components/ToolTips'
import { calculateDurationAndUnit } from '@/lib/calculateDurationAndUnit'
import { pluralize } from '@/lib/pluralize'
import { useAppState } from '@v2/state/DataProviderOnClient'
import { twJoin } from 'tailwind-merge'

export function CurrentRoundTimeLeft() {
  const { state } = useAppState()
  const { currentRoundDataPerSource, isLoading } = state

  const currentRoundEndDate = Object.values(currentRoundDataPerSource ?? {})[0]
    ?.roundEnd
    ? new Date(Object.values(currentRoundDataPerSource ?? {})[0].roundEnd)
    : null

  const isValidDate =
    currentRoundEndDate && !isNaN(currentRoundEndDate.getTime())

  const getTimeDisplay = () => {
    if (!isValidDate) return { value: '0', label: '0:00' }

    const now = new Date()
    const diff = currentRoundEndDate!.getTime() - now.getTime()
    const { duration, unit } = calculateDurationAndUnit(diff)

    if (duration <= 0) {
      return { value: "Time's", label: 'Up' }
    }

    const value = Math.floor(duration).toString()
    const label =
      pluralize({
        count: Math.floor(duration),
        singular: unit,
        prefixCount: false,
      }) + ' left'

    return { value, label }
  }

  const { value, label } = getTimeDisplay()
  const tooltipContent = timeLeftTooltip(
    isValidDate ? currentRoundEndDate : new Date(),
  )

  return (
    <Tooltip tipContents={tooltipContent} className="cursor-help">
      <div className="desktop:gap-3 flex items-center justify-center gap-2">
        <var className="important-value">{isLoading ? '...' : value}</var>
        <span
          className={twJoin(
            'has-tooltip',
            'label desktop:text-center desktop:w-auto w-min',
          )}
        >
          {isLoading ? 'Time Left' : label}
        </span>
      </div>
    </Tooltip>
  )
}
