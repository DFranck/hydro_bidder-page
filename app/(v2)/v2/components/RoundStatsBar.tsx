'use client'

import { CurrentRoundAprGlobal } from '@v2/components/CurrentRoundAprGlobal'
import { CurrentRoundNumberOfBids } from '@v2/components/CurrentRoundNumberOfBids'
import { CurrentRoundTimeLeft } from '@v2/components/CurrentRoundTimeLeft'
import { twJoin } from 'tailwind-merge'

export function RoundStatsBar() {
  return (
    <div
      className={twJoin(
        'h-bar-height-large',
        'flex items-center justify-around gap-1',
        'bg-shaded rounded-standard',
        'desktop:gap-3',
      )}
    >
      <CurrentRoundNumberOfBids />
      <CurrentRoundAprGlobal />
      <CurrentRoundTimeLeft />
    </div>
  )
}
