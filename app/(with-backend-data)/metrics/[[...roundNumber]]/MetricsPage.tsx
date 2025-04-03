"use client"

import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { ContentContainer } from "@/components/ContentContainer"
import { AllTimePoLDeployed } from "@/components/StatCards/cards/AllTimePoLDeployed"
import { AllTimeRevenue } from "@/components/StatCards/cards/AllTimeRevenue"
import { StatCardsContainer } from "@/components/StatCards/StatCardsContainer"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import { metricsPageNoDataTooltip } from "@/components/ToolTips"
import {
  AugmentedBidFromNumiaSlimmed,
  BidMetaDataSlimmed,
  BidRevampMetrics,
} from "@/contract-apis/types"
import { useBackendData } from "@/contract-apis/useBackendData"
import max from "lodash/max"
import range from "lodash/range"
import uniq from "lodash/uniq"
import Link from "next/link"
import { Fragment, ReactNode } from "react"
import { twJoin, twMerge } from "tailwind-merge"
import { MetricsTable } from "./MetricsTable"
import { AllTimeBidCount } from "@/components/StatCards/cards/AllTimeBidCount"
import ExperimentalTable from "./ExperimentalTable"

export const PRE_HYDRO_ROUND_ID = -1
export const EXPERIMENTAL_ROUND_ID = -2

export interface MetricsRow {
  _bid: BidRevampMetrics | AugmentedBidFromNumiaSlimmed
  _bidFromContract: BidRevampMetrics
  _bidMetaData: BidMetaDataSlimmed
  logoAndTitle: ReactNode
  amount: ReactNode
  duration: ReactNode
  polApr: ReactNode
  tributeApr: ReactNode
  status: ReactNode
}

export function MetricsPage({
  requestedRoundNumber,
}: {
  requestedRoundNumber: number | string | null
}) {
  const { bidsInfo, currentRoundId, tranches } = useBackendData()

  const bids = Object.values(bidsInfo)

  const postHydroRoundIdsWithBidData = uniq(bids.map((bid) => bid.roundId))

  const highestRoundIdWithData =
    max(postHydroRoundIdsWithBidData) ?? PRE_HYDRO_ROUND_ID

  const requestedRoundId =
    requestedRoundNumber === null
      ? Math.min(highestRoundIdWithData, currentRoundId - 1)
      : typeof requestedRoundNumber === "number" && requestedRoundNumber >= 1
        ? Math.min(requestedRoundNumber - 1, highestRoundIdWithData)
        : typeof requestedRoundNumber === "string" &&
            requestedRoundNumber === "experimental"
          ? EXPERIMENTAL_ROUND_ID
          : PRE_HYDRO_ROUND_ID

  const requestedPreHydro = requestedRoundId === PRE_HYDRO_ROUND_ID
  const requestedExperimental = requestedRoundId === EXPERIMENTAL_ROUND_ID
  const tabsArray = [PRE_HYDRO_ROUND_ID, ...range(currentRoundId + 1)]

  const displayTranches = tranches.map((x) => {
    const displayTrancheFromRound = x.id === 2 ? 4 : 0
    return { ...x, displayTrancheFromRound }
  })

  return (
    <>
      <StatCardsContainer>
        <AllTimePoLDeployed />
        <AllTimeRevenue />
        <AllTimeBidCount />
      </StatCardsContainer>

      <ContentContainer className="gap-6 py-6">
        <div
          data-testid="metrics-page-round-navigation"
          className="flex items-center justify-between"
        >
          <h2 className="sr-only">PoL Metrics by Round</h2>

          <StyledText variant="footnote">
            Metrics are updated at the end of each round.
          </StyledText>

          <div className="flex items-center backdrop-blur-sm">
            {tabsArray.map((roundId) => {
              const isActive = roundId === requestedRoundId
              const hasData = roundId <= highestRoundIdWithData

              return (
                <StyledText
                  as={Link}
                  variant={isActive ? "button.primary" : "button.secondary"}
                  href={hasData ? `/metrics/${roundId + 1}` : "#"}
                  key={roundId}
                  className={twMerge(
                    "group relative -mx-px rounded-none backdrop-blur-none",
                    "first:rounded-l-full",
                    "hover:scale-100",
                    "transition-all",
                    !isActive &&
                      "text-palette-green/50 hover:text-palette-green",
                    !hasData && "cursor-default",
                    tabsArray.length - 1 === roundId + 1 && "rounded-r-full",
                  )}
                >
                  <ConditionalWrapper
                    condition={!hasData}
                    wrapper={(children) => (
                      <Tooltip tipContents={metricsPageNoDataTooltip}>
                        {children}
                      </Tooltip>
                    )}
                  >
                    <span>
                      {roundId === -1 ? "Pre-Hydro" : `Round ${roundId + 1}`}
                    </span>
                  </ConditionalWrapper>
                  {roundId === currentRoundId && (
                    <span
                      className={twJoin(
                        "absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/4",
                        "rounded-full px-2 py-0.5 transition-all",
                        "border-2 border-palette-text bg-palette-text text-xs",
                        "before:absolute before:inset-0 before:-z-10 before:rounded-full",
                        "group-hover:text-palette-text group-hover:before:bg-palette-beige",
                        isActive
                          ? "text-palette-text before:bg-palette-beige"
                          : "text-palette-text/50 before:bg-palette-beige/60",
                      )}
                    >
                      Current
                    </span>
                  )}
                </StyledText>
              )
            })}
            <StyledText
              as={Link}
              variant={
                requestedRoundId === -2 ? "button.tertiary" : "button.secondary"
              }
              href="/metrics/experimental"
              className={twMerge(
                "relative -mx-px rounded-none backdrop-blur-none",
                "rounded-l-full rounded-r-full",
                "hover:scale-100",
                "transition-all",
                "border-palette-cyan",
                "ml-12",
                requestedRoundId !== -2 &&
                  "text-palette-cyan/80 hover:text-palette-cyan",
              )}
            >
              Experimental
            </StyledText>
          </div>
        </div>
        {requestedExperimental ? (
          <ExperimentalTable />
        ) : (
          <>
            {requestedPreHydro ? (
              <MetricsTable
                key={`tranche_0`}
                trancheId={0}
                requestedRoundNumber={requestedRoundNumber as number | null}
              />
            ) : (
              displayTranches.map(
                ({ id: trancheId, displayTrancheFromRound }) => {
                  if (requestedRoundId < displayTrancheFromRound) {
                    return <Fragment key={`empty_tranche_${trancheId}`} />
                  }

                  return (
                    <MetricsTable
                      key={`tranche_${trancheId}`}
                      trancheId={trancheId}
                      requestedRoundNumber={
                        requestedRoundNumber as number | null
                      }
                    />
                  )
                },
              )
            )}
          </>
        )}
      </ContentContainer>
    </>
  )
}
