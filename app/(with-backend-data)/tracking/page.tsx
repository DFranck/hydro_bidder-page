"use client"

import { TrackingTableItem } from "@/app/(with-backend-data)/tracking/TrackingTableItem"
import { getTrackingTableRows } from "@/app/(with-backend-data)/tracking/getTrackingTableRows"
import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { ContentContainer } from "@/components/ContentContainer"
import { EmptyBox } from "@/components/EmptyBox"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { StyledTable } from "@/components/StyledTable"
import { BaseRowObject, ColumnObject } from "@/components/StyledTable/types"
<<<<<<< HEAD
import { fetchTracking } from "@/contract-apis/fetchTracking"
import { useBackendData } from "@/contract-apis/useBackendData"
import { ReactNode, useEffect, useState } from "react"
import { classNames } from "./classNames"
import { BidRevampMetrics, TrackingItem } from "@/contract-apis/types"
=======
import { fetchTracking, TrackingItem } from "@/contract-apis/fetchTracking"
import { useBackendData } from "@/contract-apis/useBackendData"
import { ReactNode, useEffect, useState } from "react"
import { classNames } from "./classNames"
import { BidRevampMetrics } from "@/contract-apis/types"
>>>>>>> cbde222 (Implemented initial tracking page)

export interface TrackingRow extends BaseRowObject {
  _bid: BidRevampMetrics
  _tracking: TrackingItem
  roundId: ReactNode
  logoAndTitle: ReactNode
  venueTvl: ReactNode
  committeeHolding: ReactNode
  actions: ReactNode
  additional?: ReactNode
}

export default function TrackingPage() {
  const [isLoadingTracking, setIsLoadingTracking] = useState(false)
  const [trackingItems, setTrackingItems] = useState<TrackingItem[]>([])
  const [openedRows, setOpenedRows] = useState<number[]>([])
  const { isLoading, bidsInfo } = useBackendData()
  const bids = Object.values(bidsInfo)

  const toggleRow = (bidId: number) => {
    setOpenedRows((prev) =>
      prev.includes(bidId)
        ? prev.filter((id) => id !== bidId)
        : [...prev, bidId]
    )
  }

  const columns: ColumnObject<TrackingRow, keyof TrackingRow>[] = [
    {
      key: "roundId",
      label: "Round",
      isSortable: true,
      textAlign: "center",
      initialSortDirection: "ASC",
      propsForCells: {
        className: classNames.classNamesForCells,
      },
      customValueGetter: (row) => row._bid.roundId,
    },
    {
      key: "logoAndTitle",
      label: "Bid",
      isSortable: true,
      propsForCells: {
        className: classNames.classNamesForCells,
      },
      customValueGetter: (row) => row._bid.title,
    },
    {
      key: "venueTvl",
      label: "Venue TVL",
      isSortable: true,
      textAlign: "right",
      initialSortDirection: "DESC",
      propsForCells: {
        className: classNames.classNamesForCells,
      },
      customValueGetter: (row) => {
        const venueTvl = (row._tracking.holdings || []).reduce(
          (acc, holding) => {
            if (holding.info_missing || !holding.venue_total) {
              return { ...acc, infoMissing: true }
            }
            return {
              atom: acc.atom + holding.venue_total.total_atom,
              usdc: acc.usdc + holding.venue_total.total_usdc,
              infoMissing: false,
            }
          },
          { atom: 0, usdc: 0, infoMissing: false }
        )

        return venueTvl.infoMissing ? -1 : venueTvl.atom
      },
    },
    {
      key: "committeeHolding",
      label: "Current Committee Holdings",
      isSortable: true,
      textAlign: "right",
      initialSortDirection: "DESC",
      propsForCells: {
        className: classNames.classNamesForCells,
      },
      customValueGetter: (row) => {
        const committeeHolding = (row._tracking.holdings || []).reduce(
          (acc, holding) => {
            if (
              holding.info_missing ||
              !holding.address_holdings ||
              !holding.address_rewards
            ) {
              return { ...acc, infoMissing: true }
            }
            return {
              atom:
                acc.atom +
                holding.address_holdings.total_atom +
                holding.address_rewards.total_atom,
              usdc:
                acc.usdc +
                holding.address_holdings.total_usdc +
                holding.address_rewards.total_usdc,
              infoMissing: false,
            }
          },
          { atom: 0, usdc: 0, infoMissing: false }
        )

        return committeeHolding.infoMissing ? -1 : committeeHolding.atom
      },
    },
    {
      key: "actions",
      label: "",
      isSortable: false,
      textAlign: "right",
      propsForCells: {
        className: classNames.classNamesForCells,
      },
    },
  ]

  const trackingRows = getTrackingTableRows(
    openedRows,
    toggleRow,
    bids,
    trackingItems
  )

  useEffect(() => {
    const getTrackingData = async () => {
      setIsLoadingTracking(true)
      const trackingResponseItems = await fetchTracking()
      setTrackingItems(trackingResponseItems || [])
      setIsLoadingTracking(false)
    }
    getTrackingData()
  }, [])

  return (
    <>
      <ContentContainer className="gap-12 py-6">
        <LoadingSpinner isLoading={isLoading || isLoadingTracking} />

        {!isLoading && !isLoadingTracking && !trackingRows.length && (
          <BlurryBackdropBox>
            <EmptyBox>
              There are no tracking items available at this moment.
            </EmptyBox>
          </BlurryBackdropBox>
        )}

        {!isLoading && !isLoadingTracking && trackingRows.length > 0 && (
          <BlurryBackdropBox>
            <StyledTable
              className="border-collapse border-spacing-y-0 [&>tbody]:gap-0 [&>tbody]:max-sm:gap-1"
              initialSortedColumnKey="roundId"
              columns={columns}
              rows={trackingRows}
              renderRow={(props) => (
                <TrackingTableItem key={props.row._bid.id} {...props} />
              )}
            />
          </BlurryBackdropBox>
        )}
      </ContentContainer>
    </>
  )
}
