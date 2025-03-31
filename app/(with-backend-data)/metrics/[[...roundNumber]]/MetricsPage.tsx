"use client"

import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { ContentContainer } from "@/components/ContentContainer"
import { StatCards } from "@/components/StatCards"
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
import sumBy from "lodash/sumBy"
import uniq from "lodash/uniq"
import Link from "next/link"
import { Fragment, ReactNode } from "react"
import { twJoin, twMerge } from "tailwind-merge"
import { MetricsTable } from "./MetricsTable"

export const PRE_HYDRO_ROUND_ID = -1

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
  requestedRoundNumber: number | null
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
        : PRE_HYDRO_ROUND_ID

  const requestedPreHydro = requestedRoundId === PRE_HYDRO_ROUND_ID

  const displayTranches = tranches.map((x) => {
    const displayTrancheFromRound = x.id === 2 ? 4 : 0
    return { ...x, displayTrancheFromRound }
  })

  /* ####################################################### */

  const totalTributePaidUsd = sumBy(
    Object.values(bidsInfo),
    (bid) => bid.totalTokenBasedTributeValue,
  )
  const totalTributeOwedUsd = 667_500
  const percentRedistributed = (
    (totalTributePaidUsd / totalTributeOwedUsd) *
    100
  ).toFixed(2)

  /* ####################################################### */

  return (
    <>
      <StatCards
      // bottomSlot={
      //   <ContentContainer
      //     className={twJoin(
      //       "max-w-[90%] gap-6 pb-6",
      //       "flex flex-row items-center",
      //     )}
      //   >
      //     <div
      //       className={twJoin(
      //         "whitespace-nowrap",
      //         "text-sm font-bold transition-all xl:text-base",
      //       )}
      //     >
      //       Redistributed to ATOM Stakers:
      //     </div>

      //     <StyledText variant="progressBar.container">
      //       <StyledText
      //         variant="progressBar"
      //         style={{
      //           minWidth: `${percentRedistributed}%`,
      //         }}
      //       >
      //         {percentRedistributed}%
      //       </StyledText>
      //       <div className="px-3 font-bold text-palette-beige">
      //         ${Math.round(totalTributePaidUsd).toLocaleString()}
      //       </div>
      //     </StyledText>
      //   </ContentContainer>
      // }
      >
        <StatCards.RedistributionProgress />
        <StatCards.AllTimePoLDeployed />
        <StatCards.AllTimePoLRevenue />
      </StatCards>

      <ContentContainer className="gap-6 py-6">
        <div
          data-testid="metrics-page-round-navigation"
          className="flex items-center justify-between"
        >
          <h2 className="sr-only">PoL Metrics by Round</h2>

          <div className="flex flex-col gap-1">
            <StyledText variant="footnote">
              Metrics are updated at the end of each round.
            </StyledText>
            {/* <ProgressBar
              percentage={Number(percentRedistributed)}
              className="w-full"
            />
            <div>
              <span className="font-bold text-palette-green">
                ${Math.round(totalTributePaidUsd).toLocaleString()}
              </span>{" "}
              of <span>${totalTributeOwedUsd.toLocaleString()}</span>{" "}
              redistributed to ATOM stakers
            </div> */}
          </div>

          <div className="flex items-center backdrop-blur-sm">
            {[PRE_HYDRO_ROUND_ID, ...range(currentRoundId + 1)].map(
              (roundId) => {
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
                      "first:rounded-l-full last:rounded-r-full",
                      "hover:scale-100",
                      "transition-all",
                      !isActive &&
                        "text-palette-green/50 hover:text-palette-green",
                      !hasData && "cursor-default",
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
              },
            )}
          </div>
        </div>

        {requestedPreHydro ? (
          <MetricsTable
            key={`tranche_0`}
            trancheId={0}
            requestedRoundNumber={requestedRoundNumber}
          />
        ) : (
          displayTranches.map(({ id: trancheId, displayTrancheFromRound }) => {
            if (requestedRoundId < displayTrancheFromRound) {
              return <Fragment key={`empty_tranche_${trancheId}`} />
            }

            return (
              <MetricsTable
                key={`tranche_${trancheId}`}
                trancheId={trancheId}
                requestedRoundNumber={requestedRoundNumber}
              />
            )
          })
        )}

        <StyledText
          as="p"
          variant="footnote"
          className="mx-auto inline-block rounded-full bg-palette-text/80 px-3 py-1 text-center backdrop-blur-md"
        >
          Metrics are updated at the end of each round.
        </StyledText>
      </ContentContainer>
    </>
  )
}
