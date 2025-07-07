import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { EmptyBox } from "@/components/EmptyBox"
import { Icon } from "@/components/Icon"
import { StyledTable, TD } from "@/components/StyledTable"
import { StyledText } from "@/components/StyledText"
import { TableHeader } from "@/components/TableHeader"
import { AugmentedLockup } from "@/contract-apis/types"
import { useBackendData } from "@/contract-apis/useBackendData"
import Link from "next/link"
import { Fragment, useMemo, useState } from "react"
import { twMerge } from "tailwind-merge"
import { buildActiveColumns } from "./buildActiveColumns"
import { buildActiveRow } from "./buildActiveRow"
import { buildExpiredColumns } from "./buildExpiredColumns"
import { buildExpiredRow } from "./buildExpiredRow"
import { RowComponent } from "./RowComponent"

export function LockupsTables({
  onClickEdit,
}: {
  onClickEdit: ({ lockup }: { lockup: AugmentedLockup }) => void
}) {
  const { lockups, tranches } = useBackendData()
  const [selectedLockups, setSelectedLockups] = useState<number[]>([])

  type ActiveRow = (typeof activeLockupRows)[number]
  type ExpiredRow = (typeof expiredLockupRows)[number]

  const [activeLockupRows, expiredLockupRows] = useMemo(() => {
    const activeLockups = lockups.filter((lockup) => !lockup.isExpired)
    const expiredLockups = lockups.filter((lockup) => lockup.isExpired)

    return [
      activeLockups.map((lockup) =>
        buildActiveRow({
          lockup,
          tranches,
          onClickEdit,
          selectedLockups,
          setSelectedLockups,
        })
      ),
      expiredLockups.map((lockup) =>
        buildExpiredRow({
          lockup,
          onClickEdit,
        })
      ),
    ]
  }, [lockups, selectedLockups, tranches, onClickEdit])

  const [activeColumnDescriptors, expiredColumnDescriptors] = useMemo(
    () => [
      buildActiveColumns<ActiveRow>({
        tranches,
        lockups: lockups.filter((lockup) => !lockup.isExpired),
        selectedLockups,
        setSelectedLockups,
      }),
      buildExpiredColumns<ExpiredRow>(),
    ],
    [tranches, selectedLockups]
  )

  const activeCellRenderers = useMemo(() => {
    return {
      trancheStatus1: ({ cell, cellProps, row }: any) => {
        const { isExpired } = row._lockup
        return (
          <TD
            {...cellProps}
            key={`${row._lockup.id}-1`}
            className={twMerge(cellProps.className, isExpired && "border-x-0")}
            colSpan={isExpired ? tranches.length : undefined}
          >
            <StyledText
              key={`text_cell_${row._lockup.id}-1`}
              as="div"
              variant="label"
              className="mb-1 sm:hidden"
            >
              {tranches[0].name}
            </StyledText>

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
            <StyledText as="div" variant="label" className="mb-1 sm:hidden">
              {tranches[1].name}
            </StyledText>

            {cell}
          </TD>
        )
      },
    } as any
  }, [tranches])

  return (
    <div className="flex flex-col gap-12">
      <BlurryBackdropBox
        id="active-lockups"
        className="group flex flex-col gap-3"
      >
        <TableHeader
          leftSlot={
            <StyledText variant="h4">
              {expiredLockupRows.length > 0 && "Active "}Lockups
            </StyledText>
          }
          rightSlot={
            expiredLockupRows.length > 0 && (
              <StyledText as={Link} variant="link" href="#expired-lockups">
                <span>Jump to {expiredLockupRows.length} Expired</span>
                <Icon name="arrow-down-long" />
              </StyledText>
            )
          }
        />

        {activeLockupRows.length === 0 ? (
          <EmptyBox className="flex flex-col gap-1">
            <div>
              You don&rsquo;t have any active lockups. To create one, click the
              &ldquo;New Lockup&rdquo; button&nbsp;
              <Icon name="arrow-up-right" />
            </div>
          </EmptyBox>
        ) : (
          <StyledTable
            className="border-collapse"
            columns={activeColumnDescriptors}
            rows={activeLockupRows}
            initialSortedColumnKey="timeLeft"
            renderCells={activeCellRenderers}
            renderRow={(props) => (
              <RowComponent key={props.row._lockup.id} {...props} />
            )}
          />
        )}
      </BlurryBackdropBox>

      {expiredLockupRows.length > 0 && (
        <BlurryBackdropBox
          id="expired-lockups"
          className="group flex flex-col gap-3"
        >
          <TableHeader
            leftSlot={<StyledText variant="h4">Expired Lockups</StyledText>}
            rightSlot={
              activeLockupRows.length > 0 && (
                <StyledText as={Link} variant="link" href="#active-lockups">
                  <span>Jump to {activeLockupRows.length} Active</span>
                  <Icon name="arrow-up-long" />
                </StyledText>
              )
            }
          />

          <StyledTable
            className="border-collapse"
            columns={expiredColumnDescriptors}
            rows={expiredLockupRows}
            initialSortedColumnKey="expiredDaysAgo"
            renderRow={(props) => (
              <RowComponent key={props.row._lockup.id} {...props} />
            )}
          />
        </BlurryBackdropBox>
      )}
    </div>
  )
}
