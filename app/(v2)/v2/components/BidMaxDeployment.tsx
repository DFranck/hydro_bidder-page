'use client'

import { BidRevampMetrics } from '@/contract-apis/types'
import { formatAmount } from '@/lib/formatAmount'
import { useAppState } from '@v2/state/DataProviderOnClient'
import { SourceID } from '@v2/types'

interface BidMaxDeploymentProps {
  bidId: number
  sourceId: SourceID
  className?: string
}

export function BidMaxDeployment({
  bidId,
  sourceId,
  className,
}: BidMaxDeploymentProps) {
  const { state } = useAppState()
  const { currentRoundDataPerSource } = state

  const sourceData =
    currentRoundDataPerSource?.[
      sourceId as keyof typeof currentRoundDataPerSource
    ]
  const bid = sourceData?.augmentedBids?.find(
    (bid: BidRevampMetrics) => bid.id === bidId,
  )
  const atomPrice = sourceData?.atomPrice || 0

  if (!bid) return null

  // Only relevant from round 3 onwards (rounds are 0-indexed)
  // And if there are any point-based tribute amounts, we can't show this
  const isTokenBased = !bid.points || bid.points.length === 0
  if (bid.roundId < 2 || !isTokenBased || atomPrice <= 0) {
    return null
  }

  // Calculate max deployment amount (same logic as main)
  const minTributeFactor = 0.0001 // TODO: get this from contract or source config
  const totalTributeValueInAtom = bid.totalTokenBasedTributeValue / atomPrice
  const maxDeploymentAmountInAtom = totalTributeValueInAtom / minTributeFactor

  return (
    <span className={className}>
      ~{formatAmount(maxDeploymentAmountInAtom * 1e6, undefined, 0)} ATOM
    </span>
  )
}
