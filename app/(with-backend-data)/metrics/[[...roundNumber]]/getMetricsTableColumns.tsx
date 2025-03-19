import { ColumnObject } from "@/components/StyledTable/types"
import { MetricsRow } from "./MetricsPage"
import {
  bidTablesFirstColumnTooltips,
  liveBidTributeAprColumnTooltip,
  metricsDurationColumnTooltip,
  metricsPolRewardsColumnTooltip,
  metricsPolSizeColumnTooltip,
  metricsStatusColumnTooltip,
  pastBidTributeAprColumnTooltip,
} from "@/components/ToolTips"
import { Tooltip } from "@/components/Tooltip"
import { Icon } from "@/components/Icon"
import {
  AugmentedBidFromNumiaSlimmed,
  BidRevampMetrics,
} from "@/contract-apis/types"

export function getMetricsTableColumns(
  requestedPreHydro: boolean,
  currentRoundId: number,
  requestedRoundId: number
): ColumnObject<MetricsRow, keyof MetricsRow>[] {
  return [
    {
      key: "logoAndTitle",
      label: (
        <Tooltip
          tipContents={bidTablesFirstColumnTooltips.metricsTable.tokenBased}
        >
          <div className="flex items-center gap-1">
            Title
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      ),
      isSortable: true,
      initialSortDirection: "ASC",
      customValueGetter: (row) => row._bid.title,
    },
    {
      key: "amount",
      label: (
        <Tooltip tipContents={metricsPolSizeColumnTooltip}>
          <div className="flex items-center gap-1">
            Amount
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      ),
      textAlign: "right",
      propsForCells: {
        className: "text-balance",
      },
      isSortable: true,
      initialSortDirection: "DESC",
      customValueGetter: (row) => {
        return requestedPreHydro
          ? (row._bid as AugmentedBidFromNumiaSlimmed).requestedAllocationAmount
          : (row._bid as BidRevampMetrics).request_amount
      },
    },
    {
      key: "duration",
      label: (
        <Tooltip tipContents={metricsDurationColumnTooltip}>
          <div className="flex items-center gap-1">
            Duration
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      ),
      textAlign: "right",
      propsForCells: {
        className: "whitespace-nowrap",
      },
      isSortable: true,
      initialSortDirection: "ASC",
      customValueGetter: (row) => row._bidFromContract.duration,
    },
    {
      key: "polApr",
      label: (
        <Tooltip tipContents={metricsPolRewardsColumnTooltip}>
          <div className="flex items-center gap-1">
            PoL APR
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      ),
      textAlign: "right",
      propsForCells: {
        className: "whitespace-nowrap",
      },
      isSortable: true,
      initialSortDirection: "DESC",
      customValueGetter: (row) => row._bidFromContract.apr_pol ?? 0,
    },
    {
      key: "tributeApr",
      label: (
        <Tooltip
          tipContents={
            requestedRoundId === currentRoundId
              ? liveBidTributeAprColumnTooltip
              : pastBidTributeAprColumnTooltip
          }
          classNamesForTooltip="-ml-12"
        >
          <div className="flex items-center gap-1">
            Tribute APR
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      ),
      textAlign: "right",
      isSortable: true,
      initialSortDirection: "DESC",
      customValueGetter: ({ _bidFromContract }) => {
        return _bidFromContract.apr_tribute ?? 0
      },
    },
    {
      key: "status",
      label: (
        <Tooltip
          tipContents={metricsStatusColumnTooltip}
          classNamesForTooltip="-ml-12"
        >
          <div className="flex items-center gap-1">
            Status
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      ),
      textAlign: "right",
      propsForCells: {
        className: "text-balance",
      },
      isSortable: true,
      initialSortDirection: "ASC",
      customValueGetter: (row) => ("status" in row._bid ? row._bid.status : ""),
    },
  ]
}
