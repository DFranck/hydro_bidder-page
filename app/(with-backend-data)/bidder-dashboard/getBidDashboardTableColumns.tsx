import { classNames } from "@/app/(with-backend-data)/bidder-dashboard/classNames"
import { BidRow } from "@/app/(with-backend-data)/bidder-dashboard/page"
import { Icon } from "@/components/Icon"
import { ColumnObject } from "@/components/StyledTable/types"
import {
  currentVoteShareTooltip,
  estimatedRewardsColumnTooltip,
} from "@/components/ToolTips"
import { Tooltip } from "@/components/Tooltip"

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
      customValueGetter: (row) =>
        isTokenBased
          ? row._bid.totalTokenBasedTributeValue
          : row._bid.points?.[0] || 0,
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
      customValueGetter: (row) => row._bid.vote_perc,
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
