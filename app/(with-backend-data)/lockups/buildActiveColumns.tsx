import { Tranche } from "@/app/ts_types/HydroBase.types"
import { Icon } from "@/components/Icon"
import { BaseRowObject, ColumnObject } from "@/components/StyledTable/types"
import { Tooltip } from "@/components/Tooltip"
import { lockupsTableTimeLeftColumnTooltip } from "@/components/ToolTips"
import { AugmentedLockup } from "@/contract-apis/types"

export function buildActiveColumns<
  Row extends BaseRowObject & {
    _lockup: AugmentedLockup
  },
>({ tranches }: { tranches: Tranche[] }): ColumnObject<Row, keyof Row>[] {
  const statusColumnDescriptors = tranches.map(({ id, name }) => ({
    key: `trancheStatus${id}` as const,
    label: name,
    isSortable: true,
    initialSortDirection: "asc",
    propsForCells: {
      className: "sm:w-1/4 sm:border-x-2 sm:border-palette-beige/50",
    },
    propsForHeaderCell: {
      className: [
        "py-3",
        "border-x-2 border-t-2 border-palette-beige/50",
        "bg-palette-beige text-palette-text font-bold",
        "hover:bg-palette-beige/90",
        "border-palette-text",
      ],
    },
    customValueGetter: (row: Row) => {
      const { isExpired, isEligibleToVote } = row._lockup
      return isExpired ? 0 : isEligibleToVote ? 1 : 2
    },
  }))

  return [
    {
      key: "select",
      label: null,
    },
    {
      key: "amount",
      label: "Amount",
      isSortable: true,
    },

    {
      key: "timeLeft",
      label: (
        <Tooltip
          tipContents={lockupsTableTimeLeftColumnTooltip}
          className="flex items-center gap-1"
        >
          <span>Time Left</span>
          <Icon name="circle-info" />
        </Tooltip>
      ),
      isSortable: true,
      textAlign: "center",
      customValueGetter: (row) => {
        return row._lockup.daysLeft ?? 0
      },
    },

    ...statusColumnDescriptors,

    {
      key: "actions",
      label: "Actions",
      textAlign: "right",
    },
  ] as ColumnObject<Row, keyof Row>[]
}
