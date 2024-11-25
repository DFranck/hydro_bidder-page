"use client"

import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { ContentContainer } from "@/components/ContentContainer"
import { Icon } from "@/components/Icon"
import { InvisibleLink } from "@/components/InvisibleLink"
import { StatCards } from "@/components/StatCards"
import { StyledTable } from "@/components/StyledTable"
import { ColumnObject } from "@/components/StyledTable/types"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import {
  metricsPolAprColumnTooltip,
  metricsPolRewardsColumnTooltip,
  metricsPolValueColumnTooltip,
  metricsStatusColumnTooltip,
  metricsTributeColumnTooltip,
} from "@/components/ToolTips"
import { useContractContext } from "@/contract-apis/useContractContext"
import { amountToUSDString } from "@/lib/amountToUSDString"
import { pluralize } from "@/lib/pluralize"
import { simplifyBigNumbers } from "@/lib/simplifyBigNumbers"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { twMerge } from "tailwind-merge"

export default function Page({ params }: { params: { roundNumber?: string } }) {
  const {
    bidsByRoundId,
    preHydroBids,
    currentRoundMetadata: roundMetadata,
  } = useContractContext()

  const { roundId: currentRoundUnderHood } = roundMetadata

  const requestedRoundNumber =
    typeof params.roundNumber === "undefined"
      ? null
      : Number(params.roundNumber)
  const requestedRoundNumberUnderHood = requestedRoundNumber
    ? requestedRoundNumber - 1
    : null
  const isPreHydro = requestedRoundNumber === null

  if (
    requestedRoundNumberUnderHood &&
    requestedRoundNumberUnderHood > currentRoundUnderHood
  ) {
    notFound()
  }

  const bidsToRender =
    (isPreHydro
      ? preHydroBids
      : bidsByRoundId[requestedRoundNumberUnderHood ?? 0]) ?? []

  const rows = bidsToRender.map((bid) => {
    const rowURL = isPreHydro
      ? `https://www.mintscan.io/cosmos/proposals/${bid.id.replace("#", "")}`
      : `/bids/${bid.id}`

    return {
      _bid: bid,
      logoAndTitle: (
        <InvisibleLink href={rowURL} className="flex items-center gap-6">
          <div className="relative size-12 shrink-0 rounded-full border text-[0]">
            {bid.projectLogoUrl ? (
              <Image
                className="object-contain"
                src={bid.projectLogoUrl}
                alt={bid.project}
                fill={true}
              />
            ) : null}
          </div>

          <div className="flex flex-col">
            <StyledText variant="h4">{bid.title}</StyledText>
            <StyledText variant="footnote">{bid.project}</StyledText>
          </div>
        </InvisibleLink>
      ),
      polValue: (
        <InvisibleLink href={rowURL}>
          {bid.initialAllocationAmount.toLocaleString(undefined, {
            maximumFractionDigits: 4,
          })}
          &nbsp;ATOM
        </InvisibleLink>
      ),
      duration: (
        <InvisibleLink href={rowURL}>
          {(() => {
            const monthCount = parseFloat((bid.durationDays / 30).toFixed(1))
            return `${monthCount > 0 ? "~" : ""}${pluralize({
              count: monthCount,
              singular: "month",
              prefixCount: true,
            })}`
          })()}
        </InvisibleLink>
      ),
      polRewards: (
        <InvisibleLink href={rowURL}>
          {(
            bid.currentAllocationAmount - bid.initialAllocationAmount
          ).toLocaleString(undefined, {
            maximumFractionDigits: 4,
          })}{" "}
          ATOM
        </InvisibleLink>
      ),
      polApr: <InvisibleLink href={rowURL}>{bid.apr}%</InvisibleLink>,
      tribute: (
        <InvisibleLink href={rowURL}>
          {isPreHydro ? (
            "–"
          ) : (
            <>
              {bid.offchainTribute.map((tribute) => (
                <div
                  key={tribute.type}
                  className="flex items-center justify-end gap-1"
                >
                  <Icon name="solid:gem" />
                  <span>
                    {simplifyBigNumbers(tribute.amount, 2)}&nbsp;
                    {tribute.type}
                  </span>
                </div>
              ))}

              {bid.onchainTributeAssets.map((tribute) => (
                <div key={tribute.asset}>
                  {simplifyBigNumbers(Math.round(tribute.amount), 2)}&nbsp;
                  {tribute.asset.slice(0, 12)}
                </div>
              ))}

              {bid.onchainTributeUsdc ? (
                <StyledText variant="footnote">
                  ~{amountToUSDString(bid.onchainTributeUsdc)}
                </StyledText>
              ) : (
                "–"
              )}
            </>
          )}
        </InvisibleLink>
      ),
      status: <InvisibleLink href={rowURL}>{bid.status}</InvisibleLink>,
    }
  })

  type Row = (typeof rows)[number]

  const columns: ColumnObject<Row, keyof Row>[] = [
    {
      key: "logoAndTitle",
      label: "Bid Title / Project Name",
      isSortable: true,
      initialSortDirection: "ASC",
      customValueGetter: (row) => row._bid.title,
    },
    {
      key: "polValue",
      label: (
        <Tooltip tipContents={metricsPolValueColumnTooltip}>
          <div className="flex items-center gap-1">
            PoL Value
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      ),
      textAlign: "right",
      propsForCells: {
        className: "text-balance",
      },
      isSortable: true,
      initialSortDirection: "DESC",
      customValueGetter: (row) => row._bid.initialAllocationAmount,
    },
    {
      key: "duration",
      label: "Duration",
      propsForCells: {
        className: "whitespace-nowrap",
      },
      isSortable: true,
      initialSortDirection: "ASC",
      customValueGetter: (row) => row._bid.durationDays,
    },
    {
      key: "polRewards",
      label: (
        <Tooltip tipContents={metricsPolRewardsColumnTooltip}>
          <div className="flex items-center gap-1">
            PoL Rewards
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      ),
      textAlign: "right",
      propsForCells: {
        className: "whitespace-nowrap",
      },
      isSortable: true,
      initialSortDirection: "DESC",
      customValueGetter: (row) =>
        row._bid.currentAllocationAmount - row._bid.initialAllocationAmount,
    },
    {
      key: "polApr",
      label: (
        <Tooltip
          tipContents={metricsPolAprColumnTooltip}
          classNamesForTooltip="-ml-12"
        >
          <div className="flex items-center gap-1">
            PoL APR
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      ),
      textAlign: "right",
      propsForCells: {
        className: "text-palette-beige font-bold",
      },
      isSortable: true,
      initialSortDirection: "DESC",
      customValueGetter: (row) => row._bid.apr,
    },
    {
      key: "tribute",
      label: (
        <Tooltip
          tipContents={metricsTributeColumnTooltip}
          classNamesForTooltip="-ml-12"
        >
          <div className="flex items-center gap-1">
            Tribute
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      ),
      textAlign: "right",
      isSortable: true,
      initialSortDirection: "DESC",
      customValueGetter: (row) => row._bid.onchainTributeUsdc,
    },
    {
      key: "status",
      label: (
        <Tooltip
          tipContents={metricsStatusColumnTooltip}
          classNamesForTooltip="-ml-12"
        >
          <div className="flex items-center gap-1">
            Status
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      ),
      textAlign: "right",
      propsForCells: {
        className: "text-balance",
      },
      isSortable: true,
      initialSortDirection: "ASC",
      customValueGetter: (row) => row._bid.status,
    },
  ]

  return (
    <>
      <StatCards>
        <StatCards.PoLAvailable />
        <StatCards.PoLDeployed />
        <StatCards.PoLRevenue />
      </StatCards>

      <ContentContainer className="gap-12 py-12">
        <div className="flex items-center justify-between">
          <StyledText variant="h2">PoL Metrics by Round</StyledText>

          <div>
            {[null, ...Object.keys(bidsByRoundId).map(Number)].map(
              (roundNumber) => {
                const isActive = roundNumber === requestedRoundNumberUnderHood
                return (
                  <StyledText
                    as={Link}
                    variant={isActive ? "button.primary" : "button.secondary"}
                    href={`/metrics/${roundNumber === null ? "" : roundNumber + 1}`}
                    key={roundNumber ?? "pre-hydro"}
                    className={twMerge(
                      `
                        rounded-none
                        first:rounded-l-full
                        last:rounded-r-full
                      `,
                      !isActive && "opacity-60"
                    )}
                  >
                    {roundNumber === null
                      ? "Pre-Hydro"
                      : `Round ${roundNumber + 1}`}
                  </StyledText>
                )
              }
            )}
          </div>
        </div>

        <BlurryBackdropBox>
          <StyledTable
            columns={columns}
            rows={rows}
            initialSortedColumnKey="polValue"
          />
        </BlurryBackdropBox>
      </ContentContainer>
    </>
  )
}
