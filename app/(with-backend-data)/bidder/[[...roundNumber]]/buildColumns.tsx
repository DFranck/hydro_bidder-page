import { Icon } from "@/components/Icon"
import { ColumnObject } from "@/components/StyledTable/types"
import {
  bidTablesFirstColumnTooltips,
  liveBidTributeAprColumnTooltip,
  metricsStatusColumnTooltip,
  pastBidTributeAprMetricsPageColumnTooltip,
} from "@/components/ToolTips"
import { Tooltip } from "@/components/Tooltip"
import { BidRevampMetrics } from "@/contract-apis/types"
import { BidderRow } from "./BidderPage"

export function buildColumns(
  requestedPreHydro: boolean,
  currentRoundId: number,
  requestedRoundId: number
): ColumnObject<BidderRow, keyof BidderRow>[] {
  return [
    {
      key: "logoAndTitle",
      label: (
        <Tooltip
          tipContents={bidTablesFirstColumnTooltips.metricsTable.tokenBased}
        >
          <div className="flex items-center gap-1">
            Bid Title
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      ),
      isSortable: true,
      initialSortDirection: "ASC",
      customValueGetter: (row) => row._bid.title,
    },
    {
      key: "tributeApr",
      label: (
        <Tooltip
          tipContents={
            requestedRoundId === currentRoundId
              ? liveBidTributeAprColumnTooltip
              : pastBidTributeAprMetricsPageColumnTooltip
          }
          classNamesForTooltip="-ml-12"
        >
          <div className="flex items-center gap-1">
            Voter APR
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      ),
      textAlign: "right",
      isSortable: true,
      initialSortDirection: "DESC",
      customValueGetter: (row) =>
        requestedPreHydro
          ? 0
          : ((row._bid as BidRevampMetrics)?.apr_tribute ?? 0),
    },
    {
      key: "tributeCount",
      label: "Tribute Count",
      textAlign: "right",
      isSortable: true,
      initialSortDirection: "DESC",
      customValueGetter: (row) => row.tributeCount ?? 0,
      propsForCells: { className: "tabular-nums text-right" },
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
      customValueGetter: (row) => ("status" in row._bid ? row._bid.status : ""),
    },
    {
      key: "action",
      label: "Action",
      textAlign: "right",
      propsForCells: {
        className: "text-balance",
      },
      isSortable: true,
      initialSortDirection: "ASC",
    },
  ]
}
