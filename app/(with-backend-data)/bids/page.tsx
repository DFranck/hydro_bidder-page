"use client"

import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { ContentContainer } from "@/components/ContentContainer"
import { EmptyBox } from "@/components/EmptyBox"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { StatCardsContainer } from "@/components/StatCards/StatCardsContainer"
import { CurrentRoundAprGlobal } from "@/components/StatCards/cards/CurrentRoundAprGlobal"
import { CurrentRoundNumberOfBids } from "@/components/StatCards/cards/CurrentRoundNumberOfBids"
import { CurrentRoundTimeLeft } from "@/components/StatCards/cards/CurrentRoundTimeLeft"
import { useBackendData } from "@/contract-apis/useBackendData"
import { BidsTable } from "./BidsTable"

export default function BidsPage() {
  const backendData = useBackendData()

  const { bidsInfo, currentRoundId, isLoading, tranches } = backendData

  const bidsInRound = Object.values(bidsInfo).filter(
    (bid) => bid.roundId === currentRoundId,
  )

  return (
    <>
      <StatCardsContainer>
        <CurrentRoundNumberOfBids />
        <CurrentRoundAprGlobal />
        <CurrentRoundTimeLeft />
      </StatCardsContainer>

      <ContentContainer className="gap-12 py-6">
        <LoadingSpinner isLoading={isLoading} />

        {!isLoading && bidsInRound.length === 0 && (
          <BlurryBackdropBox>
            <EmptyBox>There are no bids available at this moment.</EmptyBox>
          </BlurryBackdropBox>
        )}

        {!isLoading &&
          bidsInRound.length > 0 &&
          tranches.map(({ id: trancheId }) => (
            <BidsTable key={`tranche_${trancheId}`} trancheId={trancheId} />
          ))}
      </ContentContainer>
    </>
  )
}
