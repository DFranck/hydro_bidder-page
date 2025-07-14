'use client'

import { AmountAndUnitPair } from '@/components/AmountAndUnitPair'
import { Icon } from '@/components/Icon'
import { StyledText } from '@/components/StyledText'
import {
  pointBasedTributeAmountTooltip,
  tokenBasedTributeAmountTooltip,
} from '@/components/ToolTips'
import { amountToUSDString } from '@/lib/amountToUSDString'
import { formatAmount } from '@/lib/formatAmount'
import { simplifyBigNumbers } from '@/lib/simplifyBigNumbers'
import { useChain } from '@cosmos-kit/react'
import { Tooltipped } from '@v2/components/Tooltipped'
import { useAppState } from '@v2/state/DataProviderOnClient'
import { AugmentedBidWithVoteData, SourceID } from '@v2/types'
import Link from 'next/link'
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
  const { isWalletConnected } = useChain('neutron')
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

  const {
    apr_tribute,
    points,
    tokenBasedTributes,
    totalTokenBasedTributeValue,
    power,
    pointProgramUrl,
  } = bid
  const voteButtonData = bid?.voteButtonData

  const totalVotingPowerOnBid = voteButtonData.hasVotedForThisBid
    ? power / 10 ** 6
    : power / 10 ** 6 +
      voteButtonData.votingPowerAvailableByTrancheId[bid.trancheId]

  const isOnlyPointBased =
    points && points.length > 0 && tokenBasedTributes.length === 0
  const tributeApr = (apr_tribute ?? 0) * 100

  const formattedTributeAprMin = tributeApr.toFixed(0)

  const tributeAmountByDenom = tokenBasedTributes.reduce(
    (acc, currTribute) => {
      if (!acc[currTribute.denom]) {
        acc[currTribute.denom] = { amount: 0 }
      }
      acc[currTribute.denom].amount += currTribute.amount
      return acc
    },
    {} as { [denom: string]: { amount: number } },
  )

  const userWillReceiveInUsd = isWalletConnected
    ? (voteButtonData.votingPowerAvailableByTrancheId[bid.trancheId] /
        totalVotingPowerOnBid) *
      totalTokenBasedTributeValue
    : 0

  const userWillReceiveInTokens = isWalletConnected
    ? Object.keys(tributeAmountByDenom).map((denom) => {
        return {
          denom,
          valueInTokens:
            (voteButtonData.votingPowerAvailableByTrancheId[bid.trancheId] /
              totalVotingPowerOnBid) *
            tributeAmountByDenom[denom]?.amount,
        }
      })
    : [{ denom: '', valueInTokens: 0 }]

  const renderedTokenBasedTributes = Object.keys(tributeAmountByDenom).map(
    (denom, index) => (
      <Tooltipped key={index} tip={tokenBasedTributeAmountTooltip}>
        <AmountAndUnitPair
          amount={simplifyBigNumbers(tributeAmountByDenom[denom].amount || 0)}
          unit={denom}
          textAlign="left"
        />
      </Tooltipped>
    ),
  )

  const renderedPointBasedTributes =
    points && points.length > 0 ? (
      <Tooltipped tip={pointBasedTributeAmountTooltip({ pointProgramUrl })}>
        <div className="flex items-center gap-1">
          <Icon name="solid:gem" />
          <AmountAndUnitPair
            amount={simplifyBigNumbers(points[0] as any)}
            unit={points[1]}
            textAlign="left"
          />
          <Icon name="circle-info" />
        </div>
      </Tooltipped>
    ) : null

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
        <StyledText variant="label">Tribute Size</StyledText>
        {tokenBasedTributes.length + (points ? points.length : 0) > 0 ? (
          <div className="flex flex-col items-start">
            {renderedTokenBasedTributes}
            {renderedPointBasedTributes}
          </div>
        ) : (
          0
        )}
      </div>
      {isOnlyPointBased ? (
        <p>
          The estimated value of this bid’s rewards cannot be determined due to
          points not having a monetary value.
        </p>
      ) : (
        <p>
          The total estimated value of this bid&rsquo;s rewards is
          currently&nbsp;
          <strong className="text-palette-green">
            {amountToUSDString(totalTokenBasedTributeValue, {
              appendUsd: false,
              numberOfDecimals: 2,
              removeTrailingZeros: true,
            })}
          </strong>
          .
        </p>
      )}
      {isWalletConnected && (
        <StyledText>
          {voteButtonData.hasVotedForThisBid
            ? isOnlyPointBased
              ? 'Because you voted for this bid, you will receive '
              : 'Because you voted on this bid, your share of the rewards would be worth an estimated '
            : isOnlyPointBased
              ? 'If you vote on this bid, you will receive '
              : 'If you vote on this bid, your share of the rewards would be worth an estimated '}
          {!isOnlyPointBased ? (
            <StyledText>
              <strong className="text-palette-green">
                {amountToUSDString(userWillReceiveInUsd)}
              </strong>
              :&nbsp;
            </StyledText>
          ) : null}
          {userWillReceiveInTokens.map((x, index) => (
            <StyledText key={`${x.denom}_${index}`}>
              {formatAmount(x.valueInTokens, 0, 2)}&nbsp;
              <StyledText className="inline-flex items-center gap-1 text-sm opacity-60">
                {x.denom}
                {index < userWillReceiveInTokens.length - 1 ? (
                  <>,&nbsp;</>
                ) : (
                  <>&nbsp;</>
                )}
              </StyledText>
            </StyledText>
          ))}
        </StyledText>
      )}
      {pointProgramUrl && !isOnlyPointBased && (
        <p>
          This bid is offering points in addition to tokens, which are not taken
          into account in this APR.{' '}
          <StyledText
            as={Link}
            href={pointProgramUrl}
            variant="link"
            className="inline-flex items-center gap-1"
          >
            Learn More <Icon name="solid:arrow-up-right" />
          </StyledText>
        </p>
      )}
      <p>
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
