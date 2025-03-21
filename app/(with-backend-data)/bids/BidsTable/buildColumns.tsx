import { Icon } from "@/components/Icon"
import { BaseRowObject, ColumnObject } from "@/components/StyledTable/types"
import { Tooltip } from "@/components/Tooltip"
import {
  bidTablesFirstColumnTooltips,
  currentVoteShareTooltip,
  liveBidTributeAprColumnTooltip,
  polDurationTooltip,
} from "@/components/ToolTips"
import { AugmentedBidAfterWallet } from "@/contract-apis/types"
import { classNames } from "./classNames"

export function buildColumns<
  Row extends BaseRowObject & {
    _bid: AugmentedBidAfterWallet
  },
>(): ColumnObject<Row, keyof Row>[] {
  return [
    {
      key: "logoAndTitle",
      label: (
        <Tooltip
          tipContents={bidTablesFirstColumnTooltips.bidsTable.tokenBased}
        >
          <div className="flex items-center gap-1">
            Title
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      ),
      isSortable: true,
      propsForCells: {
        className: classNames.classNamesForCells,
      },
      customValueGetter: (row) => row._bid.title,
    },
    {
      key: "duration",
      label: (
        <Tooltip tipContents={polDurationTooltip}>
          <div className="flex items-center gap-1">
            <span>Duration</span>
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
      customValueGetter: (row) => row._bid.deploymentDurationInEpochs,
    },
    {
      key: "tributeApr",
      label: (
        <Tooltip tipContents={liveBidTributeAprColumnTooltip}>
          <div className="flex items-center gap-1">
            <span>Tribute APR</span>
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
      customValueGetter: (row) => {
        return row._bid.tributeApr ?? 0
      },
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
