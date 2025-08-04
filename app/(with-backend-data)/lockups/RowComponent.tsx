import { TR } from "@/components/StyledTable"
import { BaseRowObject, RowRenderProps } from "@/components/StyledTable/types"
import { AugmentedLockup } from "@/contract-apis/types"
import { twMerge } from "tailwind-merge"
import { useState, useCallback } from "react"
import LockupActionModal from "./actions/components/LockupActionModal"
import { NFT_SIZES } from "./config/nft-sizes"

export function RowComponent<
  Row extends BaseRowObject & {
    _lockup: AugmentedLockup
  },
>({ children, row, rowProps }: RowRenderProps<Row, keyof Row>) {
  const { isExpired, isEligibleToVote, funds } = row._lockup
  const [open, setOpen] = useState(false)

  const handleClick = useCallback(() => {
    if (!isEligibleToVote) return
    setOpen(true)
  }, [isEligibleToVote])

  const nftSize = !NFT_SIZES.includes(funds.amount)

  return (
    <>
      <TR
        onClick={nftSize ? undefined : handleClick}
        className={twMerge(
          "cursor-pointer",
          rowProps.className,
          isExpired
            ? "[&_td]:bg-palette-red/20"
            : !isEligibleToVote
              ? "cursor-not-allowed opacity-60 transition-opacity hover:opacity-100"
              : ""
        )}
        key={row._lockup.id}
        {...rowProps}
      >
        {children}
      </TR>

      {open && (
        <LockupActionModal
          lockup={row._lockup}
          action="transfer"
          isOpen={open}
          isDisabled={!isEligibleToVote}
          onClose={() => setOpen(false)}
          onConfirm={async () => {}}
          isProcessing={false}
          showActionPanel={false}
        />
      )}
    </>
  )
}
