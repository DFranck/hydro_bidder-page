import { Tranche } from "@/app/ts_types/HydroBase.types"
import { StyledText } from "@/components/StyledText"
import { AugmentedLockup } from "@/contract-apis/types"
import { formatAmount } from "@/lib/formatAmount"
import { pluralize } from "@/lib/pluralize"
import { LockupStatus } from "./LockupStatus"
import { DECIMAL_PRECISION_FOR_LOCKING_AMOUNTS } from "@/config"

export function buildActiveRow({
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
        {formatAmount(
          lockup.funds.amount * 1e6,
          undefined,
          DECIMAL_PRECISION_FOR_LOCKING_AMOUNTS
        )}{" "}
        <StyledText variant="footnote">ATOM</StyledText>
      </>
    ),

    timeLeft: pluralize({
      count: daysLeft,
      prefixCount: true,
      singular: "day",
    }),

    ...statusCells,

    actions: (
      <StyledText
        as="button"
        variant="button.secondary"
        onClick={onClickEdit.bind(null, { lockup })}
      >
        Refresh
      </StyledText>
    ),
  }

  return cells
}
