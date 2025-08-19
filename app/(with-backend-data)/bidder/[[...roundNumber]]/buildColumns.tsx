import { Icon } from "@/components/Icon"
import { ColumnObject } from "@/components/StyledTable/types"
import {
  bidTablesFirstColumnTooltips,
  metricsStatusColumnTooltip
} from "@/components/ToolTips"
import { Tooltip } from "@/components/Tooltip"
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
  key: "tributeCount",
  label: "Tributes Count",
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
      initialSortDirection: "ASC",
      customValueGetter: (row) => ("status" in row._bid ? row._bid.status : ""),
    },{
      key: "action",
      label: "Action",
      textAlign: "right",
      propsForCells: {
        className: "text-balance",
      },
      isSortable: true,
      initialSortDirection: "ASC",
      

      }
  ]
}
