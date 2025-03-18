"use client"

import { BidsTable } from "@/components/BidsTable/BidsTable"
import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { ContentContainer } from "@/components/ContentContainer"
import { EmptyBox } from "@/components/EmptyBox"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { StatCards } from "@/components/StatCards"
import { useBackendData } from "@/contract-apis/useBackendData"

export default function BidsPage() {
  const backendData = useBackendData()

  const { bidsInfo, currentRoundId, isLoading, tranches } = backendData

  const bidsInRound = Object.values(bidsInfo).filter(
    (bid) => bid.roundId === currentRoundId
  )

  return (
    <>
      <StatCards>
        <StatCards.CurrentRoundNumberOfBids />
        <StatCards.CurrentRoundAprGlobal />
        <StatCards.CurrentRoundTimeLeft />
      </StatCards>

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
            <BidsTable key={trancheId} trancheId={trancheId} />
          ))}
      </ContentContainer>
    </>
  )
}
