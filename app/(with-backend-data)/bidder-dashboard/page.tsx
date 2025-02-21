"use client"

import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { ContentContainer } from "@/components/ContentContainer"
import { EmptyBox } from "@/components/EmptyBox"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { PopupController } from "@/components/PopupController"
import { StyledTable } from "@/components/StyledTable"
import { BaseRowObject } from "@/components/StyledTable/types"
import { useBackendData } from "@/contract-apis/useBackendData"
import { ReactNode, useState } from "react"
import { BidDashboardTableItem } from "@/app/(with-backend-data)/bidder-dashboard/BidDashboardTableItem"
import { AugmentedBid } from "@/contract-apis/fetchBackendDataAfterWallet"
import { getBidDashboardTableRows } from "@/app/(with-backend-data)/bidder-dashboard/getBidDashboardTableRows"
import { getBidDashboardTableColumns } from "@/app/(with-backend-data)/bidder-dashboard/getBidDashboardTableColumns"

export interface BidRow extends BaseRowObject {
  _bid: AugmentedBid
  logoAndTitle: ReactNode
  yourEstimatedReward: ReactNode
  currentVoteShare: ReactNode
  actions: ReactNode
  additional?: ReactNode
}

export default function BidsDashboardPage() {
  const [openedRows, setOpenedRows] = useState<number[]>([])
  const { bidsByRoundId, currentRoundId, isLoading, votesByRoundId, bidDescriptionsByBidId } = useBackendData()

  const hasVotedThisRound = votesByRoundId[currentRoundId]?.length > 0

  const toggleRow = (bidId: number) => {
    setOpenedRows((prev) => prev.includes(bidId) ? prev.filter((id) => id !== bidId) : [...prev, bidId])
  }

  const bids: { token: BidRow[], point: BidRow[] } =
    getBidDashboardTableRows(openedRows, toggleRow, bidsByRoundId[currentRoundId], bidDescriptionsByBidId)

  return (
    <>
      <PopupController />
      <ContentContainer className="gap-12 py-6">
        <LoadingSpinner isLoading={isLoading} />

        {!isLoading && !bids.point.length && !bids.token.length && (
          <BlurryBackdropBox>
            <EmptyBox>There are no bids available at this moment.</EmptyBox>
          </BlurryBackdropBox>
        )}

        {!isLoading && bids.token.length > 0 && (
          <BlurryBackdropBox>
            <StyledTable
              className="border-spacing-y-0 border-collapse [&>tbody]:gap-0 [&>tbody]:max-sm:gap-1"
              initialSortedColumnKey="yourEstimatedReward"
              columns={getBidDashboardTableColumns(true, hasVotedThisRound)}
              rows={bids.token}
              renderRow={
                (props) =>
                  <BidDashboardTableItem key={props.row._bid.id} {...props} />
              }
            />
          </BlurryBackdropBox>
        )}

        {!isLoading && bids.point.length > 0 && (
          <BlurryBackdropBox>
            <StyledTable
              initialSortedColumnKey="yourEstimatedReward"
              columns={getBidDashboardTableColumns(false, hasVotedThisRound)}
              rows={bids.point}
              renderRow={
                (props) =>
                  <BidDashboardTableItem key={props.row._bid.id} {...props} />
              }
            />
          </BlurryBackdropBox>
        )}
      </ContentContainer>
    </>
  )
}
