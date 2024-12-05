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
import { useBackendData } from "@/contract-apis/useBackendData"
import { amountToUSDString } from "@/lib/amountToUSDString"
import { simplifyBigNumbers } from "@/lib/simplifyBigNumbers"
import { sumBy, uniq } from "lodash"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { twMerge } from "tailwind-merge"

export function ClientComponent({
  requestedRoundNumberUnderHood,
  isPreHydro,
}: {
  requestedRoundNumberUnderHood: number | null
  isPreHydro: boolean
}) {
  const { metricsForPreHydroBids, metricsForPostHydroBids, currentRoundId } =
    useBackendData()

  if (
    requestedRoundNumberUnderHood &&
    requestedRoundNumberUnderHood > currentRoundId
  ) {
    notFound()
  }

  const postHydroRoundIdsWithBidData = uniq(
    metricsForPostHydroBids.map((bid) => Number(bid.roundId))
  )

  const bidsToRender = isPreHydro
    ? metricsForPreHydroBids
    : metricsForPostHydroBids.filter(
        (bid) => bid.roundId === requestedRoundNumberUnderHood
      )

  const rows = bidsToRender.map((bid) => {
    const rowURL = isPreHydro
      ? `https://www.mintscan.io/cosmos/proposals/${bid.id.replace("#", "")}`
      : `/bids/${bid.id}`

    const { projectLogoUrl, projectName, title, durationDays, status } = bid

    return {
      _bid: bid,
      logoAndTitle: (
        <InvisibleLink href={rowURL} className="flex items-center gap-6">
          <div className="relative size-12 shrink-0 rounded-full border text-[0]">
            {projectLogoUrl ? (
              <Image
                className="object-contain"
                src={projectLogoUrl}
                alt={projectName}
                fill={true}
              />
            ) : null}
          </div>

          <div className="flex flex-col">
            <StyledText variant="h4">{title}</StyledText>
            <StyledText variant="footnote">{projectName}</StyledText>
          </div>
        </InvisibleLink>
      ),
      polValue: (
        <InvisibleLink href={rowURL}>
          {"initialAllocationAmount" in bid && (
            <>
              {bid.initialAllocationAmount.toLocaleString(undefined, {
                maximumFractionDigits: 4,
              })}
              &nbsp;ATOM
            </>
          )}
        </InvisibleLink>
      ),
      duration: <InvisibleLink href={rowURL}>{bid.durationDays}</InvisibleLink>,
      polRewards: (
        <InvisibleLink href={rowURL}>
          {"currentAllocationAmount" in bid &&
            "initialAllocationAmount" in bid && (
              <>
                {(
                  bid.currentAllocationAmount - bid.initialAllocationAmount
                ).toLocaleString(undefined, {
                  maximumFractionDigits: 4,
                })}{" "}
                ATOM
              </>
            )}
        </InvisibleLink>
      ),
      polApr: (
        <InvisibleLink href={rowURL}>
          {"apr" in bid && `${bid.apr}%`}
        </InvisibleLink>
      ),
      tribute: (
        <InvisibleLink href={rowURL}>
          {bid.onchainTributeAssets.map((t) => (
            <div key={t.asset}>
              {simplifyBigNumbers(t.amount)}&nbsp;
              <span title={t.asset}>{t.asset.slice(0, 12)}</span>
            </div>
          ))}
          {bid.offchainTribute.map((t) => (
            <div key={t.type} className="flex items-center gap-1">
              <Icon name="solid:gem" />
              <span>
                {simplifyBigNumbers(t.amount)}&nbsp;{t.type}
              </span>
            </div>
          ))}
          {bid.onchainTributeUsdc > 0 && (
            <div className="text-sm opacity-60">
              {amountToUSDString(bid.onchainTributeUsdc)}
            </div>
          )}
          {isPreHydro && <div className="text-sm opacity-60">0</div>}
        </InvisibleLink>
      ),
      status: <InvisibleLink href={rowURL}>{status}</InvisibleLink>,
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
      customValueGetter: (row) =>
        "initialAllocationAmount" in row._bid
          ? row._bid.initialAllocationAmount
          : 0,
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
        "currentAllocationAmount" in row._bid &&
        "initialAllocationAmount" in row._bid
          ? row._bid.currentAllocationAmount - row._bid.initialAllocationAmount
          : 0,
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
      customValueGetter: (row) => ("apr" in row._bid ? row._bid.apr : 0),
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
      customValueGetter: (row) =>
        amountToUSDString(row._bid.onchainTributeUsdc) ||
        sumBy(row._bid.offchainTribute, "amount"),
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
      customValueGetter: (row) => ("status" in row._bid ? row._bid.status : ""),
    },
  ]

  return (
    <>
      {process.env.CONTEXT !== "production" && (
        <StatCards>
          <StatCards.PoLAvailable />
          <StatCards.PoLDeployed />
          <StatCards.PoLRevenue />
        </StatCards>
      )}

      <ContentContainer className="gap-12 py-12">
        <div className="flex items-center justify-end">
          <h2 className="sr-only">PoL Metrics by Round</h2>

          <div>
            {[null, ...postHydroRoundIdsWithBidData].map((roundNumber) => {
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
            })}
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
