'use client'

import { BidRevampMetrics } from '@/contract-apis/types'
import { Tooltipped } from '@v2/components/Tooltipped'
import { useAppState } from '@v2/state/DataProviderOnClient'
import { SourceID } from '@v2/types'
import { sumBy } from 'lodash'
import { twJoin } from 'tailwind-merge'

interface BidPolSizeProps {
  bidId: number
  sourceId: SourceID
  className?: string
}

export function BidPolSize({ bidId, sourceId, className }: BidPolSizeProps) {
  const { state } = useAppState()
  const { currentRoundDataPerSource } = state

  const sourceData =
    currentRoundDataPerSource?.[
      sourceId as keyof typeof currentRoundDataPerSource
    ]
  const bid = sourceData?.augmentedBids?.find(
    (bid: BidRevampMetrics) => bid.id === bidId,
  )

  if (!bid) return null

  const { liquidityDeployment } = bid

  if (!liquidityDeployment) {
    return (
      <span className={twJoin('footnote whitespace-nowrap', className)}>
        No data yet
      </span>
    )
  }

  const { deployedFunds } = liquidityDeployment

  const currentAllocationAmount =
    sumBy(deployedFunds, (fund) => Number(fund.amount)) / 1e6

  const isPending = bid.status?.toLowerCase().includes('pending')
  const isVoting = bid.status?.toLowerCase().includes('voting')

  const unit = bid.trancheId === 1 ? 'ATOM' : 'USDC'

  const renderPolSizeValue = () => {
    if (isPending || isVoting) {
      return <span className="footnote">Pending</span>
    }

    if (!currentAllocationAmount) {
      return <span className="footnote whitespace-nowrap">&mdash;</span>
    }

    return (
      <div className="math-symbol">
        <span className="important-value">
          {currentAllocationAmount.toLocaleString('en-US', {
            maximumFractionDigits: 4,
          })}
        </span>
        <span className="math-symbol-text">{unit}</span>
      </div>
    )
  }

  const tooltipContent = (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col">
        <span className="text-palette-beige text-sm font-medium">
          Pool Size
        </span>
        <p className="text-sm">
          {isPending || isVoting
            ? 'Pool size is pending while the bid is in voting or pending status.'
            : !currentAllocationAmount
              ? 'No liquidity has been deployed for this bid yet.'
              : `This bid has deployed ${currentAllocationAmount.toLocaleString(
                  'en-US',
                  {
                    maximumFractionDigits: 4,
                  },
                )} ${unit} in liquidity.`}
        </p>
      </div>
      <p className="text-sm">
        Pool size represents the total amount of liquidity deployed for this
        bid.
      </p>
    </div>
  )

  return (
    <Tooltipped
      className={twJoin(
        'has-tooltip',
        'relative z-20',
        'inline-flex items-center gap-1',
        className,
      )}
      tip={tooltipContent}
      classNamesForTooltip="-ml-24"
    >
      <span className="@card-is-row:flex-col flex items-center gap-1">
        {renderPolSizeValue()}
      </span>
    </Tooltipped>
  )
}
