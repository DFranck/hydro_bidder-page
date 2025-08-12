import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { EmptyBox } from "@/components/EmptyBox"
import { Icon } from "@/components/Icon"
import { StyledTable, TD } from "@/components/StyledTable"
import { StyledText } from "@/components/StyledText"
import { TableHeader } from "@/components/TableHeader"
import { AugmentedLockup } from "@/contract-apis/types"
import { useBackendData } from "@/contract-apis/useBackendData"
import Link from "next/link"
import { Fragment, useMemo } from "react"
import { twMerge } from "tailwind-merge"
import { buildActiveColumns } from "./buildActiveColumns"
import { buildActiveRow } from "./buildActiveRow"
import { buildExpiredColumns } from "./buildExpiredColumns"
import { buildExpiredRow } from "./buildExpiredRow"
import { RowComponent } from "./RowComponent"
import { Checkbox } from "@/components/ui/checkbox"
import { NFT_SIZES } from "./config/nft-sizes"
import MintNftEmptyCard from "@/components/MintNftEmptyCard"

export function LockupsTables({
  onClickEdit,
  onClickSplit,
  selectedActiveLockups,
  selectedExpiredLockups,
  initMerge,
  setSelectedActiveLockups,
  setSelectedExpiredLockups,
}: {
  onClickEdit: ({ lockup }: { lockup: AugmentedLockup }) => void
  onClickSplit: ({ lockup }: { lockup: AugmentedLockup }) => void
  selectedActiveLockups: number[]
  selectedExpiredLockups: number[]
  initMerge: boolean
  setSelectedActiveLockups: (lockups: number[]) => void
  setSelectedExpiredLockups: (lockups: number[]) => void
}) {
  const { lockups, tranches, marketplaceLockups } = useBackendData()
  const marketplaceLockupById = useMemo(
    () => new Map(marketplaceLockups.map((l) => [l.id, l])),
    [marketplaceLockups]
  )
  type ActiveRow = (typeof activeLockupRows)[number]
  type ExpiredRow = (typeof expiredLockupRows)[number]

  const allActiveLockups = lockups.filter(
    (lockup) =>
      !lockup.isExpired &&
      !NFT_SIZES.includes(lockup.funds.amount) &&
      (lockup.funds.denomInfo?.humanReadableDenom === "stATOM" ||
        lockup.funds.denomInfo?.humanReadableDenom === "dATOM")
  )

  const allActiveNftLockups = lockups.filter(
    (lockup) =>
      !lockup.isExpired &&
      lockup.funds.denomInfo?.humanReadableDenom !== "ATOM" &&
      NFT_SIZES.includes(lockup.funds.amount)
  )

  const allExpiredLockups = lockups.filter(
    (lockup) =>
      lockup.isExpired &&
      !NFT_SIZES.includes(lockup.funds.amount) &&
      (lockup.funds.denomInfo?.humanReadableDenom === "stATOM" ||
        lockup.funds.denomInfo?.humanReadableDenom === "dATOM")
  )
  const allExpiredNftLockups = lockups.filter(
    (lockup) =>
      lockup.isExpired &&
      lockup.funds.denomInfo?.humanReadableDenom !== "ATOM" &&
      NFT_SIZES.includes(lockup.funds.amount)
  )

  const mergeableLockups = [...selectedActiveLockups, ...selectedExpiredLockups]

  const active =
    selectedActiveLockups?.length ===
    allActiveLockups.length + allActiveNftLockups.length

  const allSelectedActive = active && selectedActiveLockups?.length > 0

  const expired =
    selectedExpiredLockups?.length ===
    allExpiredLockups.length + allExpiredNftLockups.length

  const allSelectedExpired = expired && selectedExpiredLockups?.length > 0

  function findMergeableLockup(find: number[]) {
    const merger = lockups.filter((lockup) => lockup.id === find[0])

    return merger[0]
  }

  const [
    activeLockupRows,
    activeNftLockupRows,
    expiredLockupRows,
    expiredNftLockupRows,
  ] = useMemo(() => {
    const getLockup = (lockup: AugmentedLockup) =>
      marketplaceLockupById.get(lockup.id) || lockup

    const activeLockups = lockups
      .filter((lockup) => !lockup.isExpired)
      .map(getLockup)
    const expiredLockups = lockups
      .filter((lockup) => lockup.isExpired)
      .map(getLockup)

    return [
      allActiveLockups.map((lockup) =>
        buildActiveRow({
          lockup,
          mergeableLockups,
          selectedActiveLockups,
          initMerge,
          tranches,
          onClickEdit,
          onClickSplit,
          setSelectedActiveLockups,
          findMergeableLockup,
        })
      ),
      allActiveNftLockups.map((lockup) =>
        buildActiveRow({
          lockup,
          mergeableLockups,
          selectedActiveLockups,
          initMerge,
          tranches,
          onClickEdit,
          onClickSplit,
          setSelectedActiveLockups,
          findMergeableLockup,
        })
      ),
      allExpiredLockups.map((lockup) =>
        buildExpiredRow({
          lockup,
          mergeableLockups,
          initMerge,
          selectedExpiredLockups,
          onClickEdit,
          onClickSplit,
          setSelectedExpiredLockups,
          findMergeableLockup,
        })
      ),
      allExpiredNftLockups.map((lockup) =>
        buildExpiredRow({
          lockup,
          mergeableLockups,
          initMerge,
          selectedExpiredLockups,
          onClickEdit,
          onClickSplit,
          setSelectedExpiredLockups,
          findMergeableLockup,
        })
      ),
    ]
  }, [
    lockups,
    allActiveLockups,
    allActiveNftLockups,
    allExpiredLockups,
    allExpiredNftLockups,
    selectedActiveLockups,
    selectedExpiredLockups,
    tranches,
    onClickEdit,
  ])

  const [activeColumnDescriptors, expiredColumnDescriptors] = useMemo(
    () => [
      buildActiveColumns<ActiveRow>({
        tranches,
      }),
      buildExpiredColumns<ExpiredRow>(),
    ],
    [tranches]
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

  const handleSelectAllActiveChange = (checked: boolean) => {
    if (checked) {
      setSelectedActiveLockups([
        ...allActiveLockups.map((lockup) => lockup.id),
        ...allActiveNftLockups.map((lockup) => lockup.id),
      ])
    } else {
      setSelectedActiveLockups([])
    }
  }

  const handleSelectAllExpiredChange = (checked: boolean) => {
    if (checked) {
      setSelectedExpiredLockups([
        ...allExpiredLockups.map((lockup) => lockup.id),
        ...allExpiredNftLockups.map((lockup) => lockup.id),
      ])
    } else {
      setSelectedExpiredLockups([])
    }
  }

  return (
    <div className="flex flex-col gap-12">
      <BlurryBackdropBox
        id="active-lockups"
        className="group flex flex-col gap-3 overflow-visible"
      >
        <TableHeader
          leftSlot={
            <div className="flex items-center justify-between gap-4">
              <Checkbox
                checked={allSelectedActive}
                disabled={allActiveLockups.length === 0 || initMerge}
                onCheckedChange={handleSelectAllActiveChange}
              />
              <StyledText variant="h4">
                {expiredLockupRows.length > 0 && "Active "}Lockups
              </StyledText>
            </div>
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
          <EmptyBox className="flex flex-col gap-1 overflow-visible">
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

      <BlurryBackdropBox
        id="active-nft-lockups"
        className="group flex flex-col gap-3 overflow-visible"
      >
        <TableHeader
          leftSlot={
            <div className="flex items-center justify-between gap-4">
              <Checkbox
                checked={allSelectedActive}
                disabled={allActiveNftLockups.length === 0 || initMerge}
                onCheckedChange={handleSelectAllActiveChange}
              />
              <StyledText variant="h4">Active NFTs</StyledText>
            </div>
          }
          rightSlot={
            expiredNftLockupRows.length > 0 && (
              <StyledText as={Link} variant="link" href="#expired-nft-lockups">
                <span>Jump to {expiredNftLockupRows.length} Expired</span>
                <Icon name="arrow-down-long" />
              </StyledText>
            )
          }
        />

        {activeNftLockupRows.length === 0 ? (
          <EmptyBox className="flex flex-col gap-1 overflow-visible">
            <MintNftEmptyCard />
          </EmptyBox>
        ) : (
          <StyledTable
            className="border-collapse"
            columns={activeColumnDescriptors}
            rows={activeNftLockupRows}
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
          className="group flex flex-col gap-3 overflow-visible"
        >
          <TableHeader
            leftSlot={
              <div className="flex items-center justify-between gap-4">
                <Checkbox
                  checked={allSelectedExpired}
                  disabled={allExpiredLockups.length === 0 || initMerge}
                  onCheckedChange={handleSelectAllExpiredChange}
                />
                <StyledText variant="h4">Expired Lockups</StyledText>
              </div>
            }
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

      {expiredNftLockupRows.length > 0 && (
        <BlurryBackdropBox
          id="expired-nft-lockups"
          className="group flex flex-col gap-3 overflow-visible"
        >
          <TableHeader
            leftSlot={
              <div className="flex items-center justify-between gap-4">
                <Checkbox
                  checked={allSelectedExpired}
                  disabled={allExpiredNftLockups.length === 0 || initMerge}
                  onCheckedChange={handleSelectAllExpiredChange}
                />
                <StyledText variant="h4">Expired NFTs</StyledText>
              </div>
            }
            rightSlot={
              activeNftLockupRows.length > 0 && (
                <StyledText as={Link} variant="link" href="#active-nft-lockups">
                  <span>Jump to {activeNftLockupRows.length} Active</span>
                  <Icon name="arrow-down-long" />
                </StyledText>
              )
            }
          />

          <StyledTable
            className="border-collapse"
            columns={expiredColumnDescriptors}
            rows={expiredNftLockupRows}
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
