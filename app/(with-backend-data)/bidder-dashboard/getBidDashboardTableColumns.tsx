import { classNames } from "@/app/(with-backend-data)/bidder-dashboard/classNames"
import { BidRow } from "@/app/(with-backend-data)/bidder-dashboard/page"
import { Icon } from "@/components/Icon"
import { ColumnObject } from "@/components/StyledTable/types"
import {
  currentVoteShareTooltip,
  estimatedRewardsColumnTooltip,
} from "@/components/ToolTips"
import { Tooltip } from "@/components/Tooltip"
import sumBy from "lodash/sumBy"

export function getBidDashboardTableColumns(
  isTokenBased: boolean,
  hasVotedThisRound: boolean
): ColumnObject<BidRow, keyof BidRow>[] {
  return [
    {
      key: "logoAndTitle",
      label: "Bid Title",
      isSortable: true,
      propsForCells: {
        className: classNames.classNamesForCells,
      },
      customValueGetter: (row) => row._bid.title,
    },
    {
      key: "tribute",
      label: (
        <Tooltip
          tipContents={estimatedRewardsColumnTooltip({
            hasVotedThisRound,
            isTokenBased,
          })}
        >
          <div className="flex items-center gap-1">
            <span className="text-nowrap">Total Tribute</span>
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      ),
      isSortable: true,
      textAlign: "right",
      initialSortDirection: "DESC",
      propsForCells: {
        className: classNames.classNamesForCells,
      },
      customValueGetter: (row) => sumBy(row._bid.tributes, "valueUsd"),
    },
    {
      key: "currentVoteShare",
      label: (
        <Tooltip
          classNamesForTooltip="-ml-24"
          tipContents={currentVoteShareTooltip}
        >
          <div className="flex items-center gap-1">
            <span>Vote %</span>
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      ),
      isSortable: true,
      initialSortDirection: "DESC",
      textAlign: "right",
      propsForCells: {
        className: classNames.classNamesForCells,
      },
      customValueGetter: (row) => row._bid.percentage,
    },
    {
      key: "actions",
      label: "Actions",
      isSortable: false,
      textAlign: "right",
      propsForCells: {
        className: classNames.classNamesForCells,
      },
    },
  ]
}
