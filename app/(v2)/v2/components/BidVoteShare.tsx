'use client'

import { ConditionalWrapper } from '@/components/ConditionalWrapper'
import { Icon } from '@/components/Icon'
import { StyledText } from '@/components/StyledText'
import { Tooltip } from '@/components/Tooltip'
import {
  bidLiquidityReceivedTooltip,
  voteThresholdTooltip,
} from '@/components/ToolTips'
import { voteThresholdByTrancheId } from '@/config'
import { BidRevampMetrics } from '@/contract-apis/types'
import { twJoin } from 'tailwind-merge'

interface BidVoteShareProps {
  bid: BidRevampMetrics
  totalLiquidityForCurrentRound?: number
  denom?: string
  className?: string
}

export function BidVoteShare({
  bid,
  totalLiquidityForCurrentRound,
  denom = 'ATOM',
  className,
}: BidVoteShareProps) {
  const totalBidLiquidity = totalLiquidityForCurrentRound
    ? totalLiquidityForCurrentRound * bid.vote_perc
    : 0
  const voteThreshold =
    voteThresholdByTrancheId[
      bid.trancheId as keyof typeof voteThresholdByTrancheId
    ]

  if (bid.vote_perc < voteThreshold) {
    return (
      <Tooltip
        tipContents={voteThresholdTooltip({ trancheId: bid.trancheId })}
        classNamesForTooltip="-ml-24"
      >
        <div className={twJoin('flex items-center gap-1', className)}>
          <StyledText variant="mathSymbol.container">
            <span>{(bid.vote_perc * 100).toFixed(2)}</span>
            <StyledText variant="mathSymbol">%</StyledText>
          </StyledText>
          <Icon name="circle-info" className="text-palette-beige text-xs" />
        </div>
      </Tooltip>
    )
  }

  return (
    <ConditionalWrapper
      condition={totalBidLiquidity > 0}
      wrapper={(children) => (
        <Tooltip
          className={twJoin(
            'inline-flex items-center gap-1',
            'border-b-2 border-dotted border-white/50 hover:border-white',
          )}
          tipContents={bidLiquidityReceivedTooltip({
            votePercentage: bid.vote_perc,
            totalBidLiquidity,
            denom,
          })}
          classNamesForTooltip="-ml-24"
        >
          {children}
        </Tooltip>
      )}
    >
      <StyledText variant="mathSymbol.container" className={className}>
        <span>{Math.round(bid.vote_perc * 100)}</span>
        <StyledText variant="mathSymbol">%</StyledText>
      </StyledText>
    </ConditionalWrapper>
  )
}
