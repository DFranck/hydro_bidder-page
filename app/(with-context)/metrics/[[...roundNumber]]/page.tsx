"use client"

import { useAppContext } from "@/app/(with-context)/context"
import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { ContentContainer } from "@/components/ContentContainer"
import { Icon } from "@/components/Icon"
import { StatCards } from "@/components/StatCards"
import { StyledTable } from "@/components/StyledTable"
import { ColumnObject } from "@/components/StyledTable/types"
import { StyledText } from "@/components/StyledText"
import { pluralize } from "@/lib/pluralize"
import { useDecoratedProposals } from "@/lib/useDecoratedProposals"
import { range } from "lodash"
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
  const decoratedProposals = useDecoratedProposals({ trancheId: 1 }) ?? []
  const requestedRoundNumber =
    typeof params.roundNumber === "undefined"
      ? null
      : Number(params.roundNumber)
  const requestedRoundNumberUnderHood = requestedRoundNumber
    ? requestedRoundNumber - 1
    : null

  if (
    requestedRoundNumberUnderHood &&
    requestedRoundNumberUnderHood > currentRoundUnderHood
  ) {
    notFound()
  }

  const normalizedProposals = !requestedRoundNumber
    ? numiaData
        .filter((proposal) => proposal.status.toLowerCase() !== "voting period")
        .map((proposal) => ({
          proposalId: proposal.id,
          logo: null,
          title: proposal.title,
          projectName: proposal.project,
          polValue: `${proposal.initial_allocation_amount.toLocaleString(
            undefined,
            {
              maximumFractionDigits: 4,
            }
          )} ATOM`,
          duration: proposal.duration_days / 30,
          polRewards:
            proposal.current_allocation_amount -
            proposal.initial_allocation_amount,
          apr: proposal.apr,
          tribute: 0,
          status: proposal.status,
          points: null,
        }))
    : decoratedProposals.map((proposal) => ({
        proposalId: proposal.proposal_id,
        logo: proposal.projectLogoUrl ? (
          <div className="relative size-12">
            <Image
              className="object-contain"
              src={proposal.projectLogoUrl}
              alt={proposal.projectName}
              fill={true}
            />
          </div>
        ) : null,
        title: proposal.title,
        projectName: proposal.projectName,
        polValue: "–", // TODO: compute this
        duration: 1,
        polRewards: 0,
        apr: 0,
        tribute: proposal.points
          ? proposal.points?.[0]
          : proposal.pricedAndNamedTributes.reduce(
              (acc, t) => acc + t.amount,
              0
            ) / 1e6,
        status: "Round Ongoing",
        points: proposal.points,
      }))

  const rows = normalizedProposals
    .map((proposal) => ({
      _proposal: proposal,
      logo: proposal.logo,
      bidTitleAndProjectName: (
        <div className="flex flex-col">
          <StyledText variant="h4">{proposal.title}</StyledText>
          <StyledText variant="footnote">{proposal.projectName}</StyledText>
        </div>
      ),
      polValue: proposal.polValue,
      duration: `~${pluralize({
        count: parseFloat((proposal.duration ?? 0).toFixed(1)),
        singular: "month",
        prefixCount: true,
      })}`,
      polRewards: `${proposal.polRewards.toLocaleString(undefined, {
        maximumFractionDigits: 4,
      })} ATOM`,
      apr: <>{proposal.apr}%</>,
      tribute: proposal.points ? (
        <>
          <Icon name="solid:gem" /> {proposal.tribute.toLocaleString("en-US")}{" "}
          {proposal.points?.[1]}
        </>
      ) : (
        <>
          {proposal.tribute.toLocaleString(undefined, {
            maximumFractionDigits: 4,
          })}{" "}
          ATOM
        </>
      ),
      status: proposal.status,
    }))
    .map((row) => ({
      ...row,
      logo: (
        <ClickableRowSurface href={`/voting/${row._proposal.proposalId}`}>
          {row.logo}
        </ClickableRowSurface>
      ),
      bidTitleAndProjectName: (
        <ClickableRowSurface href={`/voting/${row._proposal.proposalId}`}>
          {row.bidTitleAndProjectName}
        </ClickableRowSurface>
      ),
      polValue: (
        <ClickableRowSurface href={`/voting/${row._proposal.proposalId}`}>
          {row.polValue}
        </ClickableRowSurface>
      ),
      duration: (
        <ClickableRowSurface href={`/voting/${row._proposal.proposalId}`}>
          {row.duration}
        </ClickableRowSurface>
      ),
      polRewards: (
        <ClickableRowSurface href={`/voting/${row._proposal.proposalId}`}>
          {row.polRewards}
        </ClickableRowSurface>
      ),
      apr: (
        <ClickableRowSurface href={`/voting/${row._proposal.proposalId}`}>
          {row.apr}
        </ClickableRowSurface>
      ),
      tribute: (
        <ClickableRowSurface href={`/voting/${row._proposal.proposalId}`}>
          {row.tribute}
        </ClickableRowSurface>
      ),
      status: (
        <ClickableRowSurface href={`/voting/${row._proposal.proposalId}`}>
          {row.status}
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
      customValueGetter: (row) => Number(row._proposal.polValue),
    },
    {
      key: "duration",
      label: "Duration",
      propsForCells: {
        className: "whitespace-nowrap",
      },
      isSortable: true,
      initialSortDirection: "ASC",
      customValueGetter: (row) => row._proposal.duration,
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
      customValueGetter: (row) => row._proposal.polRewards,
    },
    {
      key: "apr",
      label: "APR",
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
      customValueGetter: (row) => row._proposal.tribute,
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
            {[null, ...range(0, currentRoundUnderHood + 1)].map(
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
