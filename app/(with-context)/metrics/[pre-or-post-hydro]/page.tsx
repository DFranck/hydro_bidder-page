"use client"

import { useMetricsContext } from "@/app/(with-context)/metrics/context"
import { ContentContainer } from "@/components/ContentContainer"
import { Icon } from "@/components/Icon"
import { StatCards } from "@/components/StatCards"
import { StyledTable } from "@/components/StyledTable"
import { ColumnObject } from "@/components/StyledTable/types"
import { StyledText } from "@/components/StyledText"
import { pluralize } from "@/lib/pluralize"
import { useDecoratedProposals } from "@/lib/useDecoratedProposals"
import startCase from "lodash/startCase"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { twMerge } from "tailwind-merge"

export default function Page({
  params,
}: {
  params: { "pre-or-post-hydro": string }
}) {
  const router = useRouter()
  const preOrPostHydro = params["pre-or-post-hydro"]
  const isPreHydro = preOrPostHydro === "pre-hydro"
  const isPostHydro = preOrPostHydro === "post-hydro"

  useEffect(() => {
    if (!isPreHydro && !isPostHydro) {
      router.push("/metrics/pre-hydro")
    }
  }, [isPreHydro, isPostHydro])

  const decoratedProposals = useDecoratedProposals({ trancheId: 1 }) ?? []
  const { preHydroProposals } = useMetricsContext()

  const normalizedProposals = isPreHydro
    ? preHydroProposals.map((proposal) => ({
        logo: null,
        title: proposal.title,
        projectName: proposal.project,
        polValue: `${proposal.initial_allocation.toLocaleString(undefined, {
          maximumFractionDigits: 4,
        })} ATOM`,
        duration: proposal.duration_days / 30,
        polRewards: proposal.current_allocation - proposal.initial_allocation,
        apr: proposal.apr,
        tribute: 0,
        status: proposal.concluded === "true" ? "Deployed" : "Concluded",
        points: null,
      }))
    : decoratedProposals.map((proposal) => ({
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

  const rows = normalizedProposals.map((proposal) => ({
    _proposal: proposal,
    logo: proposal.logo,
    bidTitleAndProjectName: (
      <div className="flex flex-col">
        <StyledText variant="h4">{proposal.title}</StyledText>
        <StyledText variant="footnote">{proposal.projectName}</StyledText>
      </div>
    ),
    polValue: proposal.polValue,
    duration: pluralize({
      count: proposal.duration ?? 0,
      singular: "month",
      prefixCount: true,
    }),
    polRewards: `${proposal.polRewards.toLocaleString(undefined, {
      maximumFractionDigits: 4,
    })} ATOM`,
    apr: `${proposal.apr}%`,
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
          <StyledText variant="h2">PoL Metrics</StyledText>
          <div>
            {["pre-hydro", "post-hydro"].map((preOrPostHydro) => {
              const isActive =
                (isPreHydro && preOrPostHydro === "pre-hydro") ||
                (!isPreHydro && preOrPostHydro === "post-hydro")

              return (
                <StyledText
                  as={Link}
                  variant={isActive ? "button.primary" : "button.secondary"}
                  href={`/metrics/${preOrPostHydro}`}
                  key={preOrPostHydro}
                  className={twMerge(
                    `
                      rounded-none
                      first:rounded-l-full
                      last:rounded-r-full
                    `,
                    !isActive && "opacity-60"
                  )}
                >
                  {startCase(preOrPostHydro)}
                </StyledText>
              )
            })}
          </div>
        </div>
        <div
          className="
            -mx-3
            rounded-xl
            bg-palette-text/20
            p-3
            backdrop-blur-md
          "
        >
          <StyledTable
            columns={columns}
            rows={rows}
            initialSortedColumnKey="polValue"
          />
        </div>
      </ContentContainer>
    </>
  )
}
