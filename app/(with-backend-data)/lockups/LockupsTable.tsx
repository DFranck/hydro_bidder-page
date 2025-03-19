import { buildColumns } from "@/app/(with-backend-data)/lockups/buildColumns"
import { buildRow } from "@/app/(with-backend-data)/lockups/buildRow"
import { StyledTable, TD, TR } from "@/components/StyledTable"
import { AugmentedLockup } from "@/contract-apis/types"
import { useBackendData } from "@/contract-apis/useBackendData"
import { Fragment, useMemo } from "react"
import { twMerge } from "tailwind-merge"

export function LockupsTable({
  onClickEdit,
}: {
  onClickEdit: ({ lockup }: { lockup: AugmentedLockup }) => void
}) {
  const { lockups, tranches } = useBackendData()
  type Row = (typeof lockupsAsRows)[number]

  const columnDescriptors = useMemo(
    () => buildColumns<Row>({ tranches }),
    [tranches]
  )

  const lockupsAsRows = useMemo(() => {
    return lockups.map((lockup) =>
      buildRow({
        lockup,
        tranches,
        onClickEdit,
      })
    )
  }, [lockups, tranches])

  return (
    <StyledTable
      className="border-collapse"
      columns={columnDescriptors}
      rows={lockupsAsRows}
      initialSortedColumnKey="timeLeft"
      renderCells={
        {
          trancheStatus1: ({ cell, cellProps, row }: any) => {
            const { isExpired } = row._lockup
            return (
              <TD
                {...cellProps}
                key={`${row._lockup.id}-1`}
                className={twMerge(
                  cellProps.className,
                  isExpired && "border-x-0"
                )}
                colSpan={isExpired ? tranches.length : undefined}
              >
                {cell}
              </TD>
            )
          },
          trancheStatus2: ({ cell, cellProps, row }: any) => {
            const { isExpired } = row._lockup
            return isExpired ? (
              <Fragment key={`${row._lockup.id}-2`} />
            ) : (
              <TD key={`${row._lockup.id}-2`} {...cellProps}>
                {cell}
              </TD>
            )
          },
        } as any
      }
      renderRow={({ children, row, rowProps }) => {
        const { isExpired, isEligibleToVote } = row._lockup

        return (
          <TR
            className={twMerge(
              rowProps.className,
              isExpired
                ? "[&_td]:bg-palette-red/20"
                : !isEligibleToVote
                  ? "opacity-60 transition-opacity hover:opacity-100"
                  : ""
            )}
            key={row._lockup.id}
            {...rowProps}
          >
            {children}
          </TR>
        )
      }}
    />
  )
}
