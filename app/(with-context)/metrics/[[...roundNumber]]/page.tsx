"use client"

import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { ClickableRowSurface } from "@/components/ClickableRowSurface"
import { ContentContainer } from "@/components/ContentContainer"
import { StatCards } from "@/components/StatCards"
import { StyledTable } from "@/components/StyledTable"
import { ColumnObject } from "@/components/StyledTable/types"
import { StyledText } from "@/components/StyledText"
import { useContractContext } from "@/contract-apis/useContractContext"
import { amountToUSDString } from "@/lib/amountToUSDString"
import { pluralize } from "@/lib/pluralize"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { twMerge } from "tailwind-merge"

export default function Page({ params }: { params: { roundNumber?: string } }) {
  const { bidsByRoundId, preHydroBids, roundMetadata } = useContractContext()

  const { currentRound: currentRoundUnderHood } = roundMetadata

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

  const proposalsToRender =
    (isPreHydro
      ? preHydroBids
      : bidsByRoundId[requestedRoundNumberUnderHood ?? 0]) ?? []

  const rows = proposalsToRender.map((proposal) => ({
    _proposal: proposal,
    logoAndTitle: (
      <ClickableRowSurface
        href={`/bids/${proposal.id}`}
        className="flex items-center gap-6"
      >
        <div className="relative size-12 shrink-0 rounded-full border text-[0]">
          {proposal.projectLogoUrl ? (
            <Image
              className="object-contain"
              src={proposal.projectLogoUrl}
              alt={proposal.project}
              fill={true}
            />
          ) : null}
        </div>

        <div className="flex flex-col">
          <StyledText variant="h4">{proposal.title}</StyledText>
          <StyledText variant="footnote">{proposal.project}</StyledText>
        </div>
      </ClickableRowSurface>
    ),
    polValue: (
      <ClickableRowSurface href={`/bids/${proposal.id}`}>
        {`${proposal.initialAllocationAmount.toLocaleString(undefined, {
          maximumFractionDigits: 4,
        })} ATOM`}
      </ClickableRowSurface>
    ),
    duration: (
      <ClickableRowSurface href={`/bids/${proposal.id}`}>
        {(() => {
          const monthCount = parseFloat(
            (proposal.durationDays / 30 ?? 0).toFixed(1)
          )
          return `${monthCount > 0 ? "~" : ""}${pluralize({
            count: monthCount,
            singular: "month",
            prefixCount: true,
          })}`
        })()}
      </ClickableRowSurface>
    ),
    polRewards: (
      <ClickableRowSurface href={`/bids/${proposal.id}`}>
        {(
          proposal.currentAllocationAmount - proposal.initialAllocationAmount
        ).toLocaleString(undefined, {
          maximumFractionDigits: 4,
        })}{" "}
        ATOM
      </ClickableRowSurface>
    ),
    polApr: (
      <ClickableRowSurface href={`/bids/${proposal.id}`}>
        {proposal.apr}%
      </ClickableRowSurface>
    ),
    tribute: (
      <ClickableRowSurface href={`/bids/${proposal.id}`}>
        {proposal.offchainTribute.map((tribute) => (
          <div key={tribute.type}>
            {tribute.amount.toLocaleString(undefined, {
              maximumFractionDigits: 4,
            })}{" "}
            {tribute.type}
          </div>
        ))}
        {proposal.onchainTributeAssets.map((tribute) => (
          <div key={tribute.asset}>
            {tribute.amount.toLocaleString(undefined, {
              maximumFractionDigits: 4,
            })}{" "}
            {tribute.asset.slice(0, 12)}
          </div>
        ))}
        {proposal.offchainTribute.length +
          proposal.onchainTributeAssets.length ===
        0 ? (
          "–"
        ) : proposal.onchainTributeUsdc ? (
          <StyledText variant="footnote">
            ~{amountToUSDString(proposal.onchainTributeUsdc)} USD
          </StyledText>
        ) : null}
      </ClickableRowSurface>
    ),
    status: (
      <ClickableRowSurface href={`/bids/${proposal.id}`}>
        {proposal.status}
      </ClickableRowSurface>
    ),
  }))

  type Row = (typeof rows)[number]

  const columns: ColumnObject<Row, keyof Row>[] = [
    {
      key: "logoAndTitle",
      label: "Bid Title / Project Name",
      isSortable: true,
      initialSortDirection: "ASC",
      customValueGetter: (row) => row._proposal.title,
    },
    {
      key: "polValue",
      label: "PoL Value",
      textAlign: "right",
      propsForCells: {
        className: "text-balance",
      },
      isSortable: true,
      initialSortDirection: "DESC",
      customValueGetter: (row) => row._proposal.initialAllocationAmount,
    },
    {
      key: "duration",
      label: "Duration",
      propsForCells: {
        className: "whitespace-nowrap",
      },
      isSortable: true,
      initialSortDirection: "ASC",
      customValueGetter: (row) => row._proposal.durationDays,
    },
    {
      key: "polRewards",
      label: "PoL Rewards",
      textAlign: "right",
      propsForCells: {
        className: "whitespace-nowrap",
      },
      isSortable: true,
      initialSortDirection: "DESC",
      customValueGetter: (row) =>
        row._proposal.currentAllocationAmount -
        row._proposal.initialAllocationAmount,
    },
    {
      key: "polApr",
      label: "PoL APR",
      textAlign: "right",
      propsForCells: {
        className: "text-palette-beige font-bold",
      },
      isSortable: true,
      initialSortDirection: "DESC",
      customValueGetter: (row) => row._proposal.apr,
    },
    {
      key: "tribute",
      label: "Tribute",
      textAlign: "right",
      isSortable: true,
      initialSortDirection: "DESC",
      customValueGetter: (row) => row._proposal.onchainTributeUsdc,
    },
    {
      key: "status",
      label: "Status",
      textAlign: "right",
      propsForCells: {
        className: "text-balance",
      },
      isSortable: true,
      initialSortDirection: "ASC",
      customValueGetter: (row) => row._proposal.status,
    },
  ]

  return (
    <>
      <StatCards>
        <StatCards.PoLAvailable />
        <StatCards.PoLDeployed />
        <StatCards.AverageAPR />
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
