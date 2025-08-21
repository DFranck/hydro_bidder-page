"use client"

import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { ContentContainer } from "@/components/ContentContainer"
import { Icon } from "@/components/Icon"
import { Menu, MenuItem } from "@/components/Menu"
import { AllTimeBidCount } from "@/components/StatCards/cards/AllTimeBidCount"
import { AllTimePoLDeployed } from "@/components/StatCards/cards/AllTimePoLDeployed"
import { AllTimeRevenue } from "@/components/StatCards/cards/AllTimeRevenue"
import { StatCardsContainer } from "@/components/StatCards/StatCardsContainer"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import { bidderPageNoDataTooltip } from "@/components/ToolTips"
import { BidRevampMetrics, PreHydroBid } from "@/contract-apis/types"
import { useBackendData } from "@/contract-apis/useBackendData"
import max from "lodash/max"
import range from "lodash/range"
import uniq from "lodash/uniq"
import { Fragment, ReactNode } from "react"
import { BidderTable } from "./BidderTable"

export const PRE_HYDRO_ROUND_ID = -1

export interface BidderRow {
  _bid: BidRevampMetrics | PreHydroBid
  logoAndTitle: ReactNode
  status: ReactNode
  hasTributes: boolean
  additionalTributes?: ReactNode
  tributeCount: number
  action?: ReactNode
}

export function BidderPage({
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
        : PRE_HYDRO_ROUND_ID

  const requestedPreHydro = requestedRoundId === PRE_HYDRO_ROUND_ID
  const allRoundIds = [PRE_HYDRO_ROUND_ID, ...range(currentRoundId + 1)]

  const displayTranches = tranches.map((x) => {
    const displayTrancheFromRound = x.id === 2 ? 4 : 0
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
            <Tooltip tipContents={bidderPageNoDataTooltip}>{children}</Tooltip>
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
      href: hasData ? `/bidder/${roundId + 1}` : "#",
    }
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
          data-testid="bidder-page-round-navigation"
          className="relative z-20 flex flex-col items-center justify-between gap-6 sm:flex-row"
        >
          <h2 className="sr-only">PoL Bidder by Round</h2>

          <StyledText variant="footnote">
            A bidder can be refunded at the end of its round, and tributes can be
            added at any time during or after the round.
          </StyledText>

          <div className="flex items-center backdrop-blur-sm">
            <Menu
              className="relative z-100"
              items={menuItems}
              classNameForPopup="left-auto -right-10 max-h-80 overflow-y-auto"
            >
              <StyledText
                variant="button.secondary"
                as="button"
                tabIndex={0}
              >
                {requestedPreHydro
                  ? "Pre-Hydro"
                  : (
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

        {requestedPreHydro ? (
          <BidderTable
            key={`tranche_0`}
            trancheId={0}
            requestedRoundNumber={requestedRoundNumber as number | null}
          />
        ) : (
          displayTranches.map(({ id: trancheId, displayTrancheFromRound }) => {
            if (requestedRoundId < displayTrancheFromRound) {
              return <Fragment key={`empty_tranche_${trancheId}`} />
            }

            return (
              <BidderTable
                key={`tranche_${trancheId}`}
                trancheId={trancheId}
                requestedRoundNumber={requestedRoundNumber as number | null}
              />
            )
          })
        )}
      </ContentContainer>
    </>
  )
}
