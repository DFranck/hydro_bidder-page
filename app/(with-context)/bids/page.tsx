"use client"

import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { ContentContainer } from "@/components/ContentContainer"
import { EmptyBox } from "@/components/EmptyBox"
import { Icon } from "@/components/Icon"
import { InvisibleLink } from "@/components/InvisibleLink"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { MaxReachedPopup } from "@/components/MaxReachedPopup"
import { StatCards } from "@/components/StatCards"
import { StyledTable, TD, TR } from "@/components/StyledTable"
import { ColumnObject, RowRenderFunction } from "@/components/StyledTable/types"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import {
  bidTypeTooltip,
  currentVoteShareTooltip,
  estimatedRewardsTooltip,
  pointSystemTooltip,
  VOTE_SHARE_THRESHOLD,
  voteThresholdTooltip,
} from "@/components/ToolTips"
import { VoteButton } from "@/components/VoteButton"
import { WelcomePopup } from "@/components/WelcomePopup"
import { FullyAugmentedBid } from "@/contract-apis/fetchBackendDataWithAddress"
import { useBackendData } from "@/contract-apis/useBackendData"
import { pluralize } from "@/lib/pluralize"
import { sumBy } from "lodash"
import Image from "next/image"
import { Fragment, ReactNode, useCallback } from "react"
import { classNames } from "./classNames"
import { PointBasedReward } from "./PointBasedReward"
import { TokenBasedReward } from "./TokenBasedReward"

type Row = {
  _bid: FullyAugmentedBid
  logoAndTitle: ReactNode
  deploymentDuration: ReactNode
  yourEstimatedReward: ReactNode
  currentVoteShare: ReactNode
  actions: ReactNode
}

const tokenBasedTributesLabel = "Token-Based Tributes"
const pointBasedTributesLabel = "Points-Based Tributes"

export default function BidsPage() {
  const backendData = useBackendData()

  const {
    bidDescriptionsByBidId,
    bidsByRoundId,
    isLoading,
    isWalletConnected,
    currentRoundEnd,
    currentRoundId,
    currentRoundTranches,
    totalLockedAtomGlobal: totalLockedTokensGlobal,
    maxLockedAtomGlobal: maxLockedTokensGlobal,
    votingPower,
    votes,
  } = backendData

  const showWelcomeModal =
    totalLockedTokensGlobal < maxLockedTokensGlobal && !votingPower

  const bidsToRender = bidsByRoundId[currentRoundId] ?? []

  const rows =
    bidsToRender?.map((bid) => {
      const isPointBasedBid =
        false === bid.tributes.every((t) => t.isTokenBased)
      const bidURL = `/bids/${bid.id}`
      const bidDescription = bidDescriptionsByBidId[bid.id]
      const { projectLogoUrl, projectName, pointProgramUrl } = bidDescription

      return {
        _bid: bid,
        logoAndTitle: (
          <InvisibleLink href={bidURL} className="flex items-center gap-6">
            {projectLogoUrl ? (
              <div className={classNames.bidLogo}>
                <Image
                  className="object-contain"
                  src={projectLogoUrl}
                  alt={projectName}
                  fill={true}
                />
              </div>
            ) : null}

            <div>
              <p className={classNames.bidTitle}>{bid.title}</p>

              <StyledText variant="footnote">
                {bid.tributes.map((tribute) => tribute.denom).join(", ")}
              </StyledText>
            </div>
          </InvisibleLink>
        ),
        deploymentDuration: (
          <InvisibleLink href={bidURL}>
            {bid.deploymentDuration > 0 ? bid.deploymentDuration : "?"}{" "}
            {pluralize({
              count: bid.deploymentDuration,
              singular: "month",
            })}
          </InvisibleLink>
        ),
        yourEstimatedReward: (
          <InvisibleLink href={bidURL}>
            {isPointBasedBid ? (
              <Tooltip
                tipContents={pointSystemTooltip({
                  learnMoreURL: pointProgramUrl,
                })}
              >
                <PointBasedReward bid={bid} hasVotedBids={votes.length > 0} />
              </Tooltip>
            ) : (
              <Tooltip
                tipContents={estimatedRewardsTooltip({
                  bid,
                  backendData,
                })}
              >
                <TokenBasedReward
                  bid={bid}
                  isWalletConnected={isWalletConnected}
                />
              </Tooltip>
            )}
          </InvisibleLink>
        ),
        currentVoteShare: (
          <InvisibleLink
            href={bidURL}
            className="flex flex-row-reverse items-center gap-1"
          >
            <ConditionalWrapper
              condition={Number(bid.percentage) < VOTE_SHARE_THRESHOLD}
              wrapper={(children) => (
                <Tooltip
                  tipContents={voteThresholdTooltip}
                  classNamesForTooltip="-ml-24"
                >
                  <div className="flex items-center gap-1">
                    {children}
                    <Icon
                      name="circle-info"
                      className="text-xs text-palette-beige"
                    />
                  </div>
                </Tooltip>
              )}
            >
              <span>{Math.round(Number(bid.percentage) * 100)}%</span>
            </ConditionalWrapper>
          </InvisibleLink>
        ),
        actions: (
          <InvisibleLink href={bidURL}>
            <div className="flex items-center gap-3">
              <VoteButton bidId={bid.id} size="small" />
              <StyledText variant="link" className={classNames.bidDetailsLink}>
                <span>Bid Details</span> <Icon name="chevron-right" />
              </StyledText>
            </div>
          </InvisibleLink>
        ),
      }
    }) ?? []

  const buildColumns = useCallback(
    (projectBidLabel: string): ColumnObject<Row, keyof Row>[] => [
      {
        key: "logoAndTitle",
        label: (
          <Tooltip
            tipContents={bidTypeTooltip({
              isTokenBasedBid: projectBidLabel === tokenBasedTributesLabel,
            })}
          >
            <div className="flex items-center gap-1">
              {projectBidLabel}
              <Icon name="circle-info" />
            </div>
          </Tooltip>
        ),
        isSortable: true,
        propsForCells: {
          className: classNames.classNamesForCells,
        },
        customValueGetter: (row) => row._bid.title,
      },
      {
        key: "deploymentDuration",
        label: "PoL Duration",
        isSortable: true,
        textAlign: "right",
        initialSortDirection: "DESC",
        propsForCells: {
          className: classNames.classNamesForCells,
        },
        customValueGetter: (row) => row._bid.deploymentDuration,
      },
      {
        key: "yourEstimatedReward",
        label: (
          <Tooltip
            tipContents={estimatedRewardsTooltip({
              backendData,
            })}
          >
            <div className="flex items-center gap-1">
              <span>
                {isWalletConnected && votingPower ? "Your" : "Total"} Est.
                Reward
              </span>
              <Icon name="circle-info" />
            </div>
          </Tooltip>
        ),
        isSortable: true,
        textAlign: "right",
        initialSortDirection: "DESC",
        propsForCells: {
          className: classNames.classNamesForCells,
        },
        customValueGetter: (row) => sumBy(row._bid.tributes, "valueInUsd"),
      },
      {
        key: "currentVoteShare",
        label: (
          <Tooltip
            classNamesForTooltip="-ml-24"
            tipContents={currentVoteShareTooltip}
          >
            <div className="flex items-center gap-1">
              <span>Vote %</span>
              <Icon name="circle-info" />
            </div>
          </Tooltip>
        ),
        isSortable: true,
        initialSortDirection: "DESC",
        textAlign: "right",
        propsForCells: {
          className: classNames.classNamesForCells,
        },
        customValueGetter: (row) => Number(row._bid.percentage),
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
    [
      backendData,
      classNames.classNamesForCells,
      isWalletConnected,
      tokenBasedTributesLabel,
      votingPower,
    ]
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
        Number(previousRow._bid.percentage) >= VOTE_SHARE_THRESHOLD &&
        Number(row._bid.percentage) < VOTE_SHARE_THRESHOLD

      const userVotedForBid = votes.some(
        (vote) => vote.bidId === Number(row._bid.id)
      )

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

                  <Tooltip tipContents={voteThresholdTooltip}>
                    <div className="flex items-center gap-1">
                      <Icon name="solid:circle" />
                      <span>
                        These bids are below the{" "}
                        <strong>
                          {VOTE_SHARE_THRESHOLD * 100}% vote share threshold
                        </strong>
                      </span>
                      <Icon name="circle-info" />
                    </div>
                  </Tooltip>

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
            className={userVotedForBid ? classNames.hasVotedRow : undefined}
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

  const tokenBasedBids = rows.filter((row) =>
    row._bid.tributes.every((t) => t.isTokenBased)
  )
  const pointBasedBids = rows.filter(
    (row) => false === row._bid.tributes.every((t) => t.isTokenBased)
  )

  return (
    <>
      <MaxReachedPopup />

      <WelcomePopup showModal={false} />

      <StatCards>
        <StatCards.NumberOfBids />
        <StatCards.AverageRoundApr />
        <StatCards.TimeLeft />
      </StatCards>

      <ContentContainer className="gap-12 py-12">
        <LoadingSpinner isLoading={isLoading} />

        {!isLoading && tokenBasedBids.length === 0 && (
          <BlurryBackdropBox>
            <EmptyBox>There are no bids available at this moment.</EmptyBox>
          </BlurryBackdropBox>
        )}

        {!isLoading && tokenBasedBids.length > 0 && (
          <BlurryBackdropBox>
            <StyledTable
              initialSortedColumnKey="yourEstimatedReward"
              columns={buildColumns(tokenBasedTributesLabel)}
              rows={tokenBasedBids}
              renderRow={renderRow}
            />
          </BlurryBackdropBox>
        )}

        {!isLoading && pointBasedBids.length > 0 && (
          <BlurryBackdropBox>
            <StyledTable
              initialSortedColumnKey="yourEstimatedReward"
              columns={buildColumns(pointBasedTributesLabel)}
              rows={pointBasedBids}
              renderRow={renderRow}
            />
          </BlurryBackdropBox>
        )}
      </ContentContainer>
    </>
  )
}
