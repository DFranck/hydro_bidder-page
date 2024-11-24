"use client"

import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { ClickableRowSurface } from "@/components/ClickableRowSurface"
import { ContentContainer } from "@/components/ContentContainer"
import { Icon } from "@/components/Icon"
import { MaxReachedPopup } from "@/components/MaxReachedPopup"
import { StatCards } from "@/components/StatCards"
import { StyledTable, TD, TR } from "@/components/StyledTable"
import { ColumnObject, RowRenderFunction } from "@/components/StyledTable/types"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import {
  estimatedRewardsTooltip,
  pointSystemTooltip,
  VOTE_SHARE_THRESHOLD,
  voteThresholdTooltip,
} from "@/components/ToolTips"
import { VoteButton } from "@/components/VoteButton"
import { WelcomePopup } from "@/components/WelcomePopup"
import {
  AugmentedBid,
  useContractContext,
} from "@/contract-apis/useContractContext"
import { amountToUSDString } from "@/lib/amountToUSDString"
import { useChain } from "@cosmos-kit/react"
import Image from "next/image"
import { Fragment, ReactNode, useCallback } from "react"
import { twMerge } from "tailwind-merge"
import { classNames } from "./classNames"

type Row = {
  _bid: AugmentedBid
  logoAndTitle: ReactNode
  yourEstimatedReward: ReactNode
  currentVoteShare: ReactNode
  actions: ReactNode
}

const tokenBasedTributesLabel = "Token-Based Tributes"
const pointBasedTributesLabel = "Points-Based Tributes"

const RewardDelta = ({
  deltaPercentage,
}: {
  deltaPercentage: number | null
}) => {
  if (deltaPercentage === null || deltaPercentage === 0) return null

  const isPositive = deltaPercentage > 0
  return (
    <span
      className={twMerge(
        "flex items-center gap-1 text-xs",
        isPositive ? "text-palette-green" : "text-palette-red"
      )}
    >
      <Icon name={isPositive ? "solid:arrow-up" : "solid:arrow-down"} />
      {Math.round(deltaPercentage * 100)}%
    </span>
  )
}

const TokenBasedReward = ({
  bid,
  isWalletConnected,
}: {
  bid: AugmentedBid
  isWalletConnected: boolean
}) => {
  if (!isWalletConnected) {
    return amountToUSDString(Math.round(bid.onchainTributeUsdc ?? 0), 0)
  }

  if (!bid.estimatedRewardForUser) {
    return amountToUSDString(bid.onchainTributeUsdc)
  }

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <RewardDelta deltaPercentage={bid.estimatedRewardDeltaAsPercentage} />
        {amountToUSDString(bid.estimatedRewardForUser)}
      </div>
      <StyledText variant="footnote" as="div" className="whitespace-nowrap">
        of {amountToUSDString(bid.onchainTributeUsdc)}
      </StyledText>
    </>
  )
}

const PointBasedReward = ({
  bid,
  hasVotedBids,
}: {
  bid: AugmentedBid
  hasVotedBids: boolean
}) => {
  if (hasVotedBids) {
    return (
      <div className="flex flex-col">
        {amountToUSDString(Math.round(bid.estimatedRewardForUser ?? 0), 0)}{" "}
        <StyledText variant="footnote">
          of {amountToUSDString(Math.round(bid.onchainTributeUsdc ?? 0), 0)}
        </StyledText>
      </div>
    )
  }

  return (
    <>
      {bid.offchainTribute.map((tribute) => (
        <div key={tribute.type}>
          {tribute.amount.toLocaleString()}&nbsp;
          {tribute.type.slice(0, 12)}
        </div>
      ))}
    </>
  )
}

export default function BidsPage() {
  const { bidsByRoundId, roundMetadata, isLoading } = useContractContext()

  const { isWalletConnected } = useChain("neutron")

  const showWelcomeModal =
    roundMetadata.totalLockedTokens < roundMetadata.maxLockedTokens &&
    !roundMetadata.usersVotingPower

  const rows =
    bidsByRoundId[roundMetadata.currentRound]?.map((bid) => {
      const isPointBasedBid = bid.offchainTribute.length > 0

      return {
        _bid: bid,
        logoAndTitle: (
          <ClickableRowSurface
            href={`/bids/${bid.id}`}
            className="flex items-center gap-6"
          >
            {bid.projectLogoUrl ? (
              <div className={classNames.bidLogo}>
                <Image
                  className="object-contain"
                  src={bid.projectLogoUrl}
                  alt={bid.project}
                  fill={true}
                />
              </div>
            ) : null}
            <p className={classNames.bidTitle}>{bid.title}</p>
          </ClickableRowSurface>
        ),
        yourEstimatedReward: (
          <ClickableRowSurface href={`/bids/${bid.id}`}>
            {isPointBasedBid ? (
              <Tooltip
                tipContents={pointSystemTooltip({
                  learnMoreURL: bid.offchainTributeInfo,
                })}
              >
                <PointBasedReward
                  bid={bid}
                  hasVotedBids={roundMetadata.usersVotedBidIds.length > 0}
                />
              </Tooltip>
            ) : (
              <Tooltip
                tipContents={estimatedRewardsTooltip({
                  bid,
                  roundMetadata,
                })}
              >
                <TokenBasedReward
                  bid={bid}
                  isWalletConnected={isWalletConnected}
                />
              </Tooltip>
            )}
          </ClickableRowSurface>
        ),
        currentVoteShare: (
          <ClickableRowSurface
            href={`/bids/${bid.id}`}
            className="flex flex-row-reverse items-center gap-1"
          >
            <span>{Math.round(bid.votingPowerPercentage * 100)}%</span>
            {bid.votingPowerPercentage < VOTE_SHARE_THRESHOLD && (
              <Tooltip
                tipContents={voteThresholdTooltip}
                classNamesForTooltip="-ml-24"
              >
                <Icon
                  name="solid:circle"
                  className="text-xs text-palette-beige"
                />
              </Tooltip>
            )}
          </ClickableRowSurface>
        ),
        actions: (
          <ClickableRowSurface href={`/bids/${bid.id}`}>
            <VoteButton bidId={bid.id} size="small" />
          </ClickableRowSurface>
        ),
      }
    }) ?? []

  const buildColumns = useCallback(
    (projectBidLabel: string): ColumnObject<Row, keyof Row>[] => [
      {
        key: "logoAndTitle",
        label: (
          <div className="flex items-center gap-1">
            {projectBidLabel}
            <Tooltip
              tipContents={
                <>
                  Bids are submitted by projects.{" "}
                  {projectBidLabel === tokenBasedTributesLabel ? (
                    <>These bids use live tokens as their tribute.</>
                  ) : (
                    <>
                      These bids use points as their tribute because they do not
                      yet have a live token.
                    </>
                  )}{" "}
                  You can only vote once (per bucket per tranche) but you can
                  switch your vote as many times as you want.
                </>
              }
            />
          </div>
        ),
        isSortable: true,
        propsForCells: {
          className: classNames.classNamesForCells,
        },
        customValueGetter: (row) => row._bid.title,
      },
      {
        key: "yourEstimatedReward",
        label: (
          <div className="flex items-center gap-1">
            {isWalletConnected && roundMetadata.usersVotingPower
              ? "Your"
              : "Total"}{" "}
            Est. Reward
            <Tooltip
              tipContents={estimatedRewardsTooltip({
                roundMetadata,
              })}
            />
          </div>
        ),
        isSortable: true,
        textAlign: "right",
        initialSortDirection: "DESC",
        propsForCells: {
          className: classNames.classNamesForCells,
        },
        customValueGetter: (row) =>
          (row._bid.offchainTribute.length > 0
            ? -1
            : roundMetadata.usersVotedBidIds
              ? row._bid.estimatedRewardForUser
              : row._bid.onchainTributeUsdc) ?? -1,
      },
      {
        key: "currentVoteShare",
        label: (
          <div className="flex items-center gap-1">
            Vote %
            <Tooltip
              classNamesForTooltip="-ml-24"
              tipContents={
                <>
                  This is the percentage of votes that this project has received
                  so far. It may increase or decrease if other users decide to
                  switch their votes before the round ends
                </>
              }
            />
          </div>
        ),
        isSortable: true,
        initialSortDirection: "DESC",
        textAlign: "right",
        propsForCells: {
          className: classNames.classNamesForCells,
        },
        customValueGetter: (row) => row._bid.votingPowerPercentage,
      },
      {
        key: "actions",
        label: "Actions",
        isSortable: false,
        textAlign: "right",
        propsForCells: {
          className: classNames.classNamesForCells,
        },
      },
    ],
    [isWalletConnected, classNames.classNamesForCells, roundMetadata]
  )

  const renderRow = useCallback<RowRenderFunction<Row, keyof Row>>(
    ({
      children,
      row,
      rowIndex,
      rowProps,
      sortedColumnKey,
      sortDirection,
      sortedRows,
    }) => {
      const previousRow = sortedRows?.[
        rowIndex - 1
      ] as (typeof sortedRows)[number]
      const nextRow = sortedRows?.[rowIndex + 1] as (typeof sortedRows)[number]

      const shouldShowVoteThresholdLine =
        sortedColumnKey === "currentVoteShare" &&
        previousRow &&
        nextRow &&
        Number(previousRow._bid.votingPowerPercentage) >=
          VOTE_SHARE_THRESHOLD &&
        Number(row._bid.votingPowerPercentage) < VOTE_SHARE_THRESHOLD

      return (
        <Fragment key={row._bid.id}>
          {!!shouldShowVoteThresholdLine && (
            <TR className="js-vote-threshold-line">
              <TD colSpan={99} className="!p-0">
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    whitespace-nowrap
                    text-xs
                    text-palette-beige
                  "
                >
                  <div
                    className="
                      w-full
                      border-t-2
                      border-palette-beige
                    "
                  />

                  <div className="flex items-center gap-1">
                    <Icon name="solid:circle" />
                    <span>
                      These bids are below the{" "}
                      <strong>
                        {VOTE_SHARE_THRESHOLD * 100}% vote share threshold
                      </strong>
                    </span>
                    <Tooltip tipContents={voteThresholdTooltip} />
                  </div>

                  <div
                    className="
                      w-full
                      border-t-2
                      border-palette-beige
                    "
                  />
                </div>
              </TD>
            </TR>
          )}
          <TR
            className={
              row._bid.hasVotedForBid ? classNames.hasVotedRow : undefined
            }
            key={row._bid.id}
            {...rowProps}
          >
            {children}
          </TR>
        </Fragment>
      )
    },
    [classNames.hasVotedRow, voteThresholdTooltip]
  )

  return (
    <>
      <MaxReachedPopup />

      <WelcomePopup showModal={false} />

      <StatCards>
        <StatCards.TotalTributes />
        <StatCards.AverageAPR />
        <StatCards.DaysRemaining />
      </StatCards>

      <ContentContainer className="gap-12 py-12">
        <BlurryBackdropBox>
          {rows.length === 0 && (
            <div className={classNames.noBids}>
              <p>There are no bids available at this moment.</p>
            </div>
          )}

          <StyledTable
            initialSortedColumnKey="yourEstimatedReward"
            columns={buildColumns(tokenBasedTributesLabel)}
            rows={rows.filter(
              (row) => row._bid.onchainTributeAssets.length > 0
            )}
            renderRow={renderRow}
          />
        </BlurryBackdropBox>

        <BlurryBackdropBox>
          <StyledTable
            initialSortedColumnKey="yourEstimatedReward"
            columns={buildColumns(pointBasedTributesLabel)}
            rows={rows.filter((row) => row._bid.offchainTribute.length > 0)}
            renderRow={renderRow}
          />
        </BlurryBackdropBox>
      </ContentContainer>
    </>
  )
}
