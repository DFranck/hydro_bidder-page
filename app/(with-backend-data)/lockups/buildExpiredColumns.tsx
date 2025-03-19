import { BaseRowObject, ColumnObject } from "@/components/StyledTable/types"
import { AugmentedLockup } from "@/contract-apis/types"

export function buildExpiredColumns<
  Row extends BaseRowObject & {
    _lockup: AugmentedLockup
  },
>(): ColumnObject<Row, keyof Row>[] {
  return [
    {
      key: "amount",
      label: "Amount",
      isSortable: true,
    },

    {
      key: "originalDuration",
      label: "Original Duration",
      isSortable: true,
      textAlign: "center",
      customValueGetter: (row) => {
        const totalDays =
          row._lockup.dateEnd.getTime() - row._lockup.dateStart.getTime()

        return totalDays / (1000 * 60 * 60 * 24)
      },
    },

    {
      key: "expiredDaysAgo",
      label: "Expiration",
      isSortable: true,
      textAlign: "center",
      customValueGetter: (row) => {
        return row._lockup.daysLeft ?? 0
      },
    },

    {
      key: "actions",
      label: "Actions",
      textAlign: "right",
    },
  ] as ColumnObject<Row, keyof Row>[]
}
