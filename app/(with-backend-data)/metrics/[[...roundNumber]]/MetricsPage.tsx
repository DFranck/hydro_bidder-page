"use client"

import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { ContentContainer } from "@/components/ContentContainer"
import { Icon } from "@/components/Icon"
import { Menu, MenuItem } from "@/components/Menu"
import { EmptyBox } from "@/components/EmptyBox"
import { AllTimeBidCount } from "@/components/StatCards/cards/AllTimeBidCount"
import { AllTimePoLDeployed } from "@/components/StatCards/cards/AllTimePoLDeployed"
import { AllTimeRevenue } from "@/components/StatCards/cards/AllTimeRevenue"
import { StatCardsContainer } from "@/components/StatCards/StatCardsContainer"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import { metricsPageNoDataTooltip } from "@/components/ToolTips"
import { BidRevampMetrics, PreHydroBid } from "@/contract-apis/types"
import { useBackendData } from "@/contract-apis/useBackendData"
import max from "lodash/max"
import range from "lodash/range"
import uniq from "lodash/uniq"
import { Fragment, ReactNode } from "react"
import { twJoin } from "tailwind-merge"
import ExperimentalTable from "./ExperimentalTable"
import { MetricsTable } from "./MetricsTable"

export const PRE_HYDRO_ROUND_ID = -1
export const EXPERIMENTAL_ROUND_ID = -2
export const ATOM_BUCKET_STARTING_ROUND = 0
export const USDC_BUCKET_STARTING_ROUND = 4
export const STOSMO_VOTE_TOKEN_STARTING_ROUND = 6

export interface MetricsRow {
  _bid: BidRevampMetrics | PreHydroBid
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
  const allRoundIds = [PRE_HYDRO_ROUND_ID, ...range(currentRoundId + 1)]

  const displayTranches = tranches.map((x) => {
    const displayTrancheFromRound =
      x.id === 2 ? USDC_BUCKET_STARTING_ROUND : ATOM_BUCKET_STARTING_ROUND
    return { ...x, displayTrancheFromRound }
  })

  const menuItems: MenuItem[] = allRoundIds.map((roundId) => {
    const isActive = roundId === requestedRoundId
    const hasData = roundId <= highestRoundIdWithData

    return {
      icon: isActive ? "solid:check" : undefined,
      isActive,
      label: (
        <ConditionalWrapper
          condition={!hasData}
          wrapper={(children) => (
            <Tooltip tipContents={metricsPageNoDataTooltip}>{children}</Tooltip>
          )}
        >
          {roundId === PRE_HYDRO_ROUND_ID
            ? "Pre-Hydro"
            : `Round ${roundId + 1}`}
          {roundId === currentRoundId && (
            <StyledText variant="badge">Current</StyledText>
          )}
        </ConditionalWrapper>
      ),
      href: hasData ? `/metrics/${roundId + 1}` : "#",
    }
  })

  const isExperimentalActive = requestedRoundId === EXPERIMENTAL_ROUND_ID

  menuItems.push({
    href: "/metrics/experimental",
    icon: "solid:flask",
    isActive: isExperimentalActive,
    label: "Experimental",
    className: twJoin(
      isExperimentalActive
        ? "bg-palette-cyan hover:bg-palette-cyan/80"
        : "text-palette-cyan"
    ),
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
          className="relative z-20 flex flex-col items-center justify-between gap-6 sm:flex-row"
        >
          <h2 className="sr-only">PoL Metrics by Round</h2>

          <StyledText variant="footnote">
            Metrics are updated at the end of each round.
          </StyledText>

          <div className="flex items-center backdrop-blur-sm">
            <Menu
              className="relative z-[100]"
              items={menuItems}
              classNameForPopup="left-auto -right-10 max-h-80 overflow-y-auto"
            >
              <StyledText
                variant="button.secondary"
                as="button"
                tabIndex={0}
                className={twJoin(
                  isExperimentalActive &&
                    "border-palette-cyan text-palette-cyan"
                )}
              >
                {isExperimentalActive ? (
                  <>
                    <Icon name="solid:flask" /> Experimental
                  </>
                ) : requestedPreHydro ? (
                  "Pre-Hydro"
                ) : (
                  <>
                    Round {requestedRoundId + 1}
                    {requestedRoundId === currentRoundId && (
                      <StyledText variant="badge">Current</StyledText>
                    )}
                  </>
                )}

                <Icon name="solid:caret-down" />
              </StyledText>
            </Menu>
          </div>
        </div>
        {requestedExperimental ? (
          <ExperimentalTable />
        ) : (
          <>
            {requestedPreHydro ? (
              <MetricsTable
                key="tranche_0"
                trancheId={0}
                requestedRoundNumber={requestedRoundNumber as number | null}
              />
            ) : process.env.NEXT_PUBLIC_VOTING_TOKEN_NAME !== "ATOM" &&
              requestedRoundId < STOSMO_VOTE_TOKEN_STARTING_ROUND ? (
              <EmptyBox>
                <StyledText>
                  Hydro was not active for this voting token at this point!
                </StyledText>
              </EmptyBox>
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
                }
              )
            )}
          </>
        )}
      </ContentContainer>
    </>
  )
}
