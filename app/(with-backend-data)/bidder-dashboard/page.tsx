"use client"

import { BidDashboardTableItem } from "@/app/(with-backend-data)/bidder-dashboard/BidDashboardTableItem"
import { getBidDashboardTableColumns } from "@/app/(with-backend-data)/bidder-dashboard/getBidDashboardTableColumns"
import { getBidDashboardTableRows } from "@/app/(with-backend-data)/bidder-dashboard/getBidDashboardTableRows"
import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { ContentContainer } from "@/components/ContentContainer"
import { EmptyBox } from "@/components/EmptyBox"
import { Icon } from "@/components/Icon"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { StyledTable } from "@/components/StyledTable"
import { BaseRowObject } from "@/components/StyledTable/types"
import { StyledText } from "@/components/StyledText"
import { AugmentedBid } from "@/contract-apis/fetchBackendDataAfterWallet"
import { useBackendData } from "@/contract-apis/useBackendData"
import xor from "lodash/xor"
import { ReactNode, useMemo, useState } from "react"

export interface BidRow extends BaseRowObject {
  _bid: AugmentedBid
  logoAndTitle: ReactNode
  tribute: ReactNode
  currentVoteShare: ReactNode
  actions: ReactNode
  additional?: ReactNode
}

export default function BidsDashboardPage() {
  const [openedRows, setOpenedRows] = useState<number[]>([])

  const {
    bidDescriptionsByBidId,
    bidsById,
    currentRoundId,
    isLoading,
    votesByRoundId,
  } = useBackendData()

  const hasVotedThisRound = votesByRoundId[currentRoundId]?.length > 0

  const bids: { token: BidRow[]; point: BidRow[] } = useMemo(() => {
    function toggleRow(bidId: number) {
      setOpenedRows((prev) => xor(prev, [bidId]))
    }

    return getBidDashboardTableRows(
      openedRows,
      toggleRow,
      Object.values(bidsById).filter((bid) => bid.roundId === currentRoundId),
      bidDescriptionsByBidId
    )
  }, [bidDescriptionsByBidId, bidsById, currentRoundId, openedRows])

  return (
    <>
      <ContentContainer className="gap-12 py-6">
        <LoadingSpinner isLoading={isLoading} />

        {!isLoading && bids.point.length + bids.token.length === 0 && (
          <BlurryBackdropBox>
            <EmptyBox>There are no bids available at this moment.</EmptyBox>
          </BlurryBackdropBox>
        )}

        {!isLoading && bids.point.length + bids.token.length > 0 && (
          <div className="flex flex-row-reverse items-center gap-2">
            <StyledText
              as="button"
              variant="button.secondary.small"
              onClick={() =>
                setOpenedRows(
                  [...bids.token, ...bids.point].map((bid) => bid._bid.id)
                )
              }
            >
              <Icon name="square-plus" />
              <span>Expand All</span>
            </StyledText>

            <StyledText
              as="button"
              variant="button.secondary.small"
              onClick={() => setOpenedRows([])}
            >
              <Icon name="square-minus" />
              <span>Collapse All</span>
            </StyledText>
          </div>
        )}

        {!isLoading && bids.token.length > 0 && (
          <BlurryBackdropBox>
            <StyledTable
              className="border-collapse border-spacing-y-0 [&>tbody]:gap-0 [&>tbody]:max-sm:gap-1"
              initialSortedColumnKey="tribute"
              columns={getBidDashboardTableColumns(true, hasVotedThisRound)}
              rows={bids.token}
              renderRow={(props) => (
                <BidDashboardTableItem key={props.row._bid.id} {...props} />
              )}
            />
          </BlurryBackdropBox>
        )}

        {!isLoading && bids.point.length > 0 && (
          <BlurryBackdropBox>
            <StyledTable
              className="border-collapse border-spacing-y-0 [&>tbody]:gap-0 [&>tbody]:max-sm:gap-1"
              initialSortedColumnKey="tribute"
              columns={getBidDashboardTableColumns(false, hasVotedThisRound)}
              rows={bids.point}
              renderRow={(props) => (
                <BidDashboardTableItem key={props.row._bid.id} {...props} />
              )}
            />
          </BlurryBackdropBox>
        )}
      </ContentContainer>
    </>
  )
}
