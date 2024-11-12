"use client"

import { useMetricsContext } from "@/app/(with-context)/metrics/context"
import { ContentContainer } from "@/components/ContentContainer"
import { PrettyTable } from "@/components/PrettyTable"
import { ColumnObject } from "@/components/PrettyTable/types"
import { StyledText } from "@/components/StyledText"
import { useDecoratedProposals } from "@/lib/useDecoratedProposals"
import startCase from "lodash/startCase"
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
        title: proposal.title,
        projectName: proposal.project,
        polValue: proposal.initial_allocation,
        duration: (proposal.duration_days / 30).toFixed(1),
        polRewards: proposal.current_allocation - proposal.initial_allocation,
        apr: proposal.apr,
        tribute: 0,
        status: proposal.concluded === "true" ? "Deployed" : "Concluded",
      }))
    : decoratedProposals.map((proposal) => ({
        title: proposal.title,
        projectName: proposal.projectName,
        polValue: "Pending Round Closure", // TODO: compute this
        duration: 1,
        polRewards: 0,
        apr: 0,
        tribute: (
          proposal.pricedAndNamedTributes.reduce(
            (acc, t) => acc + t.amount,
            0
          ) / 1e6
        ).toLocaleString(undefined, {
          maximumFractionDigits: 4,
        }),
        status: "???",
      }))

  const rows = normalizedProposals.map((proposal) => ({
    _proposal: proposal,
    bidTitleAndProjectName: (
      <div className="flex flex-col">
        <StyledText variant="h4">{proposal.title}</StyledText>
        <StyledText variant="footnote">{proposal.projectName}</StyledText>
      </div>
    ),
    polValue: `${proposal.polValue.toLocaleString(undefined, {
      maximumFractionDigits: 4,
    })} ATOM`,
    duration: `${proposal.duration} months`,
    polRewards: `${proposal.polRewards.toLocaleString(undefined, {
      maximumFractionDigits: 4,
    })} ATOM`,
    apr: `${proposal.apr}%`,
    tribute: `${proposal.tribute}`,
    status: proposal.status,
  }))

  type Row = (typeof rows)[number]

  const columns: ColumnObject<Row, keyof Row>[] = [
    {
      key: "bidTitleAndProjectName",
      label: "Bid Title / Project Name",
    },
    {
      key: "polValue",
      label: "PoL Value",
      textAlign: "right",
      propsForCells: {
        className: "whitespace-nowrap",
      },
    },
    {
      key: "duration",
      label: "Duration",
      propsForCells: {
        className: "whitespace-nowrap",
      },
    },
    {
      key: "polRewards",
      label: "PoL Rewards",
      textAlign: "right",
      propsForCells: {
        className: "whitespace-nowrap",
      },
    },
    {
      key: "apr",
      label: "APR",
      textAlign: "right",
    },
    {
      key: "tribute",
      label: "Tribute",
      textAlign: "right",
    },
    {
      key: "status",
      label: "Status",
      textAlign: "right",
    },
  ]

  return (
    <ContentContainer className="gap-12 py-12">
      <div className="flex items-center justify-between">
        <StyledText variant="h2">Metrics</StyledText>
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
        <PrettyTable columns={columns} rows={rows} />
      </div>
    </ContentContainer>
  )
}
