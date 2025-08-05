'use client'

import { ConditionalWrapper } from '@/components/ConditionalWrapper'
import {
  bidLiquidityReceivedTooltip,
  voteThresholdTooltip,
} from '@/components/ToolTips'
import { Tooltipped } from '@v2/components/Tooltipped'
import { SourceID, getEnvironment, getSource } from '@v2/environments'
import { useAppState } from '@v2/state/DataProviderOnClient'
import { AugmentedBidWithVoteData } from '@v2/types'
import { twJoin } from 'tailwind-merge'

interface BidVoteShareProps {
  bidId: number
  sourceId: SourceID
  totalLiquidityForCurrentRound?: number
  className?: string
}

export function BidVoteShare({
  bidId,
  sourceId,
  totalLiquidityForCurrentRound,
  className,
}: BidVoteShareProps) {
  const { state } = useAppState()
  const { currentRoundDataPerSource } = state

  const environment = getEnvironment()
  const source = getSource(environment, sourceId)
  const denom = source.label

  const sourceData =
    currentRoundDataPerSource?.[
      sourceId as keyof typeof currentRoundDataPerSource
    ]
  const bid = sourceData?.augmentedBids?.find(
    (bid: AugmentedBidWithVoteData) => bid.id === bidId,
  )

  if (!bid) return null

  const totalBidLiquidity = totalLiquidityForCurrentRound
    ? totalLiquidityForCurrentRound * bid.vote_perc
    : 0
  const voteThreshold =
    source.voteThresholds[bid.trancheId as keyof typeof source.voteThresholds]

  if (bid.vote_perc < voteThreshold) {
    const percentage = bid.vote_perc * 100
    const formattedPercentage =
      percentage === 0 ? '0' : Math.floor(percentage * 100) / 100

    return (
      <Tooltipped
        className={twJoin(
          'has-tooltip',
          'relative z-20',
          'inline-flex items-center gap-1',
          className,
        )}
        tip={voteThresholdTooltip({ trancheId: bid.trancheId })}
        classNamesForTooltip="-ml-24 -translate-y-36"
      >
        <div className="math-symbol">
          <span className="important-value">{formattedPercentage}</span>
          <span className="math-symbol-text">%</span>
        </div>
      </Tooltipped>
    )
  }

  const percentage = bid.vote_perc * 100
  const formattedPercentage = percentage === 0 ? '0' : Math.floor(percentage)

  return (
    <ConditionalWrapper
      condition={totalBidLiquidity > 0}
      wrapper={(children) => (
        <Tooltipped
          className={twJoin(
            'has-tooltip',
            'relative z-20',
            'gap-tighter inline-flex items-center',
          )}
          tip={bidLiquidityReceivedTooltip({
            votePercentage: bid.vote_perc,
            totalBidLiquidity,
            denom,
          })}
          classNamesForTooltip="-ml-24 -translate-y-38"
        >
          {children}
        </Tooltipped>
      )}
    >
      <div className={twJoin('math-symbol', className)}>
        <span className="important-value">{formattedPercentage}</span>
        <span className="math-symbol-text">%</span>
      </div>
    </ConditionalWrapper>
  )
}
