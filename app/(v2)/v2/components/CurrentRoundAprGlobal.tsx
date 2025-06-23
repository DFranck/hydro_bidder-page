'use client'

import { Tooltip } from '@/components/Tooltip'
import { averageAPRTooltip } from '@/components/ToolTips'
import { voteThresholdByTrancheId } from '@/config'
import { useAtomPrice } from '@v2/hooks'
import { useAppState } from '@v2/state/DataProviderOnClient'
import sumBy from 'lodash/sumBy'
import { twJoin } from 'tailwind-merge'

export function CurrentRoundAprGlobal() {
  const { state } = useAppState()
  const { currentRoundDataPerSource, isLoading } = state
  const atomPrice = useAtomPrice()

  const allBids = Object.values(currentRoundDataPerSource ?? {}).flatMap(
    (sourceData) => sourceData.augmentedBids ?? [],
  )

  const tokenBasedBidsAboveThreshold = allBids.filter((bid) => {
    const voteThreshold =
      voteThresholdByTrancheId[
        bid.trancheId as keyof typeof voteThresholdByTrancheId
      ]

    return !bid.points?.length && bid.vote_perc >= voteThreshold
  })

  const summedTributeOverDuration = sumBy(
    tokenBasedBidsAboveThreshold,
    (bid) => bid.totalTokenBasedTributeValue / bid.duration,
  )

  const summedVotingPowerInUsd = sumBy(
    tokenBasedBidsAboveThreshold,
    (bid) => (bid.power / 1e6) * atomPrice,
  )

  const averageApr =
    summedVotingPowerInUsd > 0
      ? (summedTributeOverDuration / summedVotingPowerInUsd) * 12
      : 0

  return (
    <Tooltip tipContents={averageAPRTooltip} className="cursor-help">
      <div className="desktop:gap-3 flex items-center justify-center gap-2">
        <var className="important-value">
          {isLoading
            ? '...'
            : (averageApr || 0).toLocaleString('en-US', {
                style: 'percent',
              })}
        </var>
        <span
          className={twJoin(
            'label desktop:text-center desktop:w-auto w-min',
            'border-b-2 border-dotted border-white/50 hover:border-white',
          )}
        >
          Average APR
        </span>
      </div>
    </Tooltip>
  )
}
