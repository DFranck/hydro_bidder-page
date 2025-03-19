import { Tranche } from "@/app/ts_types/HydroBase.types"
import { LockupStatus } from "@/components/LockupStatus"
import { StyledText } from "@/components/StyledText"
import { AugmentedLockup } from "@/contract-apis/types"
import { formatAmount } from "@/lib/formatAmount"
import { pluralize } from "@/lib/pluralize"
import { twJoin } from "tailwind-merge"

export function buildRow({
  lockup,
  tranches,
  onClickEdit,
}: {
  lockup: AugmentedLockup
  tranches: Tranche[]
  onClickEdit: ({ lockup }: { lockup: AugmentedLockup }) => void
}) {
  const { daysLeft } = lockup

  const statusCells = Object.fromEntries(
    tranches.map(({ id }) => {
      return [
        `trancheStatus${id}` as const,
        <LockupStatus
          key={`trancheStatus${id}`}
          lockupId={lockup.id}
          trancheId={id}
        />,
      ]
    })
  )

  const cells = {
    _lockup: { ...lockup, daysLeft },

    amount: (
      <>
        {formatAmount(lockup.funds.amount * 1e6, undefined, 6)}{" "}
        <StyledText variant="footnote">ATOM</StyledText>
      </>
    ),

    timeLeft:
      daysLeft <= 0 ? (
        <>Expired</>
      ) : (
        pluralize({
          count: daysLeft,
          prefixCount: true,
          singular: "day",
        })
      ),

    ...statusCells,

    actions: (
      <StyledText
        as="button"
        variant="button.secondary"
        className={twJoin(
          lockup.isExpired ? "border-palette-red text-palette-red" : undefined
        )}
        onClick={onClickEdit.bind(null, { lockup })}
      >
        {lockup.isExpired ? "Refresh" : "Edit"}
      </StyledText>
    ),
  }

  return cells
}
