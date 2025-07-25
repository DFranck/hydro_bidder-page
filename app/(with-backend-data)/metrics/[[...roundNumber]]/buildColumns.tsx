import { Icon } from "@/components/Icon"
import { ColumnObject } from "@/components/StyledTable/types"
import {
  bidTablesFirstColumnTooltips,
  liveBidTributeAprColumnTooltip,
  metricsDurationColumnTooltip,
  metricsPolRewardsColumnTooltip,
  metricsPolSizeColumnTooltip,
  metricsStatusColumnTooltip,
  pastBidTributeAprMetricsPageColumnTooltip,
} from "@/components/ToolTips"
import { Tooltip } from "@/components/Tooltip"
import { BidRevampMetrics, PreHydroBid } from "@/contract-apis/types"
import { MetricsRow } from "./MetricsPage"
import { sumBy } from "lodash"

export function buildColumns(
  requestedPreHydro: boolean,
  currentRoundId: number,
  requestedRoundId: number,
): ColumnObject<MetricsRow, keyof MetricsRow>[] {
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
        if (requestedPreHydro) {
          return (row._bid as PreHydroBid).current_allocation_amount
        }

        const bid = row._bid as BidRevampMetrics

        return (
          sumBy(bid.liquidityDeployment?.deployedFunds, (fund) =>
            Number(fund.amount)
          ) / 1e6
        )
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
      customValueGetter: (row) => {
        if (requestedPreHydro) {
          return (row._bid as PreHydroBid)?.duration_days ?? 0
        }

        return (row._bid as BidRevampMetrics)?.duration
      },
    },
    {
      key: "polApr",
      label: (
        <Tooltip tipContents={metricsPolRewardsColumnTooltip}>
          <div className="flex items-center gap-1">
            Total APR
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
      customValueGetter: (row) =>
        requestedPreHydro
          ? ((row._bid as PreHydroBid)?.apr ?? 0)
          : ((row._bid as BidRevampMetrics)?.apr_pol ?? 0),
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
