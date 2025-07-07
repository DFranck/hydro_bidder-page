import { Tranche } from "@/app/ts_types/HydroBase.types"
import { StyledText } from "@/components/StyledText"
import { AugmentedLockup } from "@/contract-apis/types"
import { formatAmount } from "@/lib/formatAmount"
import { pluralize } from "@/lib/pluralize"
import { LockupStatus } from "./LockupStatus"
import { DECIMAL_PRECISION_FOR_LOCKING_AMOUNTS } from "@/config"
import { Checkbox } from "@/components/ui/checkbox"

export function buildActiveRow({
  lockup,
  tranches,
  onClickEdit,
  selectedLockups,
  setSelectedLockups,
}: {
  lockup: AugmentedLockup
  tranches: Tranche[]
  onClickEdit: ({ lockup }: { lockup: AugmentedLockup }) => void
  selectedLockups: number[]
  setSelectedLockups: (lockups: number[]) => void
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

  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      // Add lockup ID to selectedLockups if not already present
      if (!selectedLockups.includes(lockup.id)) {
        setSelectedLockups([...selectedLockups, lockup.id])
      }
    } else {
      // Remove lockup ID from selectedLockups
      setSelectedLockups(selectedLockups.filter((id) => id !== lockup.id))
    }
  }

  const cells = {
    _lockup: { ...lockup, daysLeft },

    select: (
      <Checkbox
        checked={selectedLockups.includes(lockup.id)}
        onCheckedChange={handleCheckboxChange}
      />
    ),

    amount: (
      <div className="flex items-center gap-1">
        <StyledText>
          {formatAmount(
            lockup.funds.amount * 1e6,
            undefined,
            DECIMAL_PRECISION_FOR_LOCKING_AMOUNTS
          )}
        </StyledText>
        <StyledText variant="footnote">
          {lockup.funds.denomInfo?.humanReadableDenom}
        </StyledText>
      </div>
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
