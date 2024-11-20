"use client"

import { useAppContext } from "@/app/(with-context)/context"
import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { ContentContainer } from "@/components/ContentContainer"
import { StatCards } from "@/components/StatCards"
import { StyledTable } from "@/components/StyledTable"
import { ColumnObject } from "@/components/StyledTable/types"
import { StyledText } from "@/components/StyledText"
import { amountToUSDString } from "@/lib/amountToUSDString"
import { pluralize } from "@/lib/pluralize"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

export default function Page({ params }: { params: { roundNumber?: string } }) {
  const {
    globalState: { currentRound: currentRoundUnderHood },
    numiaData,
  } = useAppContext()
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

  const preHydroProposals = numiaData.filter(
    (proposal) => proposal.round.toLowerCase() === "pre-hydro"
  )

  const proposalsByRound = numiaData
    .filter((proposal) => proposal.round.toLowerCase() !== "pre-hydro")
    .reduce(
      (acc, proposal) => {
        acc[proposal.round] = [...(acc[proposal.round] ?? []), proposal]
        return acc
      },
      {} as Record<string, typeof numiaData>
    )

  const proposalsToRender = isPreHydro
    ? preHydroProposals
    : proposalsByRound[requestedRoundNumberUnderHood ?? 0]

  console.log({ proposalsToRender })

  const rows = proposalsToRender.map((proposal) => ({
    _proposal: proposal,
    logo: (
      <ClickableRowSurface href={`/voting/${proposal.id}`}>
        {proposal.project_logo_url ? (
          <div className="relative size-12">
            <Image
              className="object-contain"
              src={proposal.project_logo_url}
              alt={proposal.project}
              fill={true}
            />
          </div>
        ) : null}
      </ClickableRowSurface>
    ),
    bidTitleAndProjectName: (
      <ClickableRowSurface href={`/voting/${proposal.id}`}>
        <div className="flex flex-col">
          <StyledText variant="h4">{proposal.title}</StyledText>
          <StyledText variant="footnote">{proposal.project}</StyledText>
        </div>
      </ClickableRowSurface>
    ),
    polValue: (
      <ClickableRowSurface href={`/voting/${proposal.id}`}>
        {`${proposal.initial_allocation_amount.toLocaleString(undefined, {
          maximumFractionDigits: 4,
        })} ATOM`}
      </ClickableRowSurface>
    ),
    duration: (
      <ClickableRowSurface href={`/voting/${proposal.id}`}>
        {(() => {
          const monthCount = parseFloat(
            (proposal.duration_days / 30 ?? 0).toFixed(1)
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
      <ClickableRowSurface href={`/voting/${proposal.id}`}>
        {(
          proposal.current_allocation_amount -
          proposal.initial_allocation_amount
        ).toLocaleString(undefined, {
          maximumFractionDigits: 4,
        })}{" "}
        ATOM
      </ClickableRowSurface>
    ),
    polApr: (
      <ClickableRowSurface href={`/voting/${proposal.id}`}>
        {proposal.apr}%
      </ClickableRowSurface>
    ),
    tribute: (
      <ClickableRowSurface href={`/voting/${proposal.id}`}>
        {proposal.offchain_tribute.map((tribute) => (
          <div key={tribute.type}>
            {tribute.amount.toLocaleString(undefined, {
              maximumFractionDigits: 4,
            })}{" "}
            {tribute.type}
          </div>
        ))}
        {proposal.onchain_tribute_assets.map((tribute) => (
          <div key={tribute.asset}>
            {tribute.amount.toLocaleString(undefined, {
              maximumFractionDigits: 4,
            })}{" "}
            {tribute.asset.slice(0, 12)}
          </div>
        ))}
        {proposal.offchain_tribute.length +
          proposal.onchain_tribute_assets.length ===
        0 ? (
          "–"
        ) : proposal.onchain_tribute_usdc ? (
          <StyledText variant="footnote">
            ~{amountToUSDString(proposal.onchain_tribute_usdc)} USD
          </StyledText>
        ) : null}
      </ClickableRowSurface>
    ),
    status: (
      <ClickableRowSurface href={`/voting/${proposal.id}`}>
        {proposal.status}
      </ClickableRowSurface>
    ),
  }))

  type Row = (typeof rows)[number]

  const columns: ColumnObject<Row, keyof Row>[] = [
    {
      key: "logo",
      label: "",
      propsForCells: {
        className: "w-min",
      },
    },
    {
      key: "bidTitleAndProjectName",
      label: "Bid Title / Project Name",
      isSortable: true,
      initialSortDirection: "ASC",
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
      customValueGetter: (row) => row._proposal.initial_allocation_amount,
    },
    {
      key: "duration",
      label: "Duration",
      propsForCells: {
        className: "whitespace-nowrap",
      },
      isSortable: true,
      initialSortDirection: "ASC",
      customValueGetter: (row) => row._proposal.duration_days,
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
        row._proposal.current_allocation_amount -
        row._proposal.initial_allocation_amount,
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
      customValueGetter: (row) => row._proposal.onchain_tribute_usdc,
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
            {[null, ...Object.keys(proposalsByRound).map(Number)].map(
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

function ClickableRowSurface({
  children,
  href,
}: {
  children: ReactNode
  href: string
}) {
  return (
    <div className="relative">
      {children}
      <Link href={href} className="absolute inset-0" />
    </div>
  )
}
