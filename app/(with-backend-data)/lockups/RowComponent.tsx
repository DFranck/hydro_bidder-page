import { TR } from "@/components/StyledTable"
import { BaseRowObject, RowRenderProps } from "@/components/StyledTable/types"
import { AugmentedLockup } from "@/contract-apis/types"
import { twMerge } from "tailwind-merge"

export function RowComponent<
  Row extends BaseRowObject & {
    _lockup: AugmentedLockup
  },
>({ children, row, rowProps }: RowRenderProps<Row, keyof Row>) {
  const { isExpired, isEligibleToVote } = row._lockup

  return (
    <TR
      className={twMerge(
        rowProps.className,
        isExpired
          ? "[&_td]:bg-palette-red/20"
          : !isEligibleToVote
            ? "opacity-60 transition-opacity hover:opacity-100"
            : "",
      )}
      key={row._lockup.id}
      {...rowProps}
    >
      {children}
    </TR>
  )
}
