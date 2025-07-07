'use client'

import { Tooltipped } from '@v2/components/Tooltipped'
import { useAppState } from '@v2/state/DataProviderOnClient'
import { AugmentedBidWithVoteData, SourceID } from '@v2/types'
import { twJoin } from 'tailwind-merge'

interface BidTributeAprProps {
  bidId: number
  sourceId: SourceID
  className?: string
}

export function BidTributeApr({
  bidId,
  sourceId,
  className,
}: BidTributeAprProps) {
  const { state } = useAppState()
  const { currentRoundDataPerSource } = state

  const sourceData =
    currentRoundDataPerSource?.[
      sourceId as keyof typeof currentRoundDataPerSource
    ]
  const bid = sourceData?.augmentedBids?.find(
    (bid: AugmentedBidWithVoteData) => bid.id === bidId,
  )

  if (!bid) return null

  const { apr_tribute, points, tokenBasedTributes } = bid

  const isOnlyPointBased =
    points && points.length > 0 && tokenBasedTributes.length === 0
  const tributeApr = (apr_tribute ?? 0) * 100

  const formattedTributeAprMin = tributeApr.toFixed(0)

  const renderAprValue = () => {
    if (Number.isNaN(tributeApr)) {
      return (
        <div className="math-symbol">
          <span className="important-value">0</span>
          <span className="math-symbol-text">%</span>
        </div>
      )
    }

    if (tributeApr > 1000) {
      return (
        <div className="math-symbol">
          <span>&gt;</span>
          <span className="important-value">1,000</span>
          <span className="math-symbol-text">%</span>
        </div>
      )
    }

    return (
      <>
        <span className="math-symbol">
          <span className="important-value">{formattedTributeAprMin}</span>
          <span className="math-symbol-text">%</span>
        </span>
        {points && points.length > 0 && <span>+&nbsp;Points</span>}
      </>
    )
  }

  const tooltipContent = (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col">
        <span className="text-palette-beige text-sm font-medium">
          Tribute APR
        </span>
        <p className="text-sm">
          {isOnlyPointBased
            ? 'This bid offers points as tribute instead of tokens.'
            : `This bid offers a ${formattedTributeAprMin}% APR in tribute tokens.`}
        </p>
      </div>
      {points && points.length > 0 && (
        <p className="text-sm">
          This bid also offers points in addition to tokens, which are not
          included in this APR calculation.
        </p>
      )}
      <p className="text-sm">
        The APR is based on total voting power associated with the bid at the
        end of the round.
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
        {renderAprValue()}
      </span>
    </Tooltipped>
  )
}
