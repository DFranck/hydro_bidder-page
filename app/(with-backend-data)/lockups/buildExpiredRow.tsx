import { StyledText } from "@/components/StyledText"
import { Checkbox } from "@/components/ui/checkbox"
import { DECIMAL_PRECISION_FOR_LOCKING_AMOUNTS } from "@/config"
import { AugmentedLockup } from "@/contract-apis/types"
import { formatAmount } from "@/lib/formatAmount"
import { getTimeBetweenDates } from "@/lib/getTimeBetweenDates"

export function buildExpiredRow({
  lockup,
  onClickEdit,
  selectedExpiredLockups,
  setSelectedExpiredLockups,
}: {
  lockup: AugmentedLockup
  onClickEdit: ({ lockup }: { lockup: AugmentedLockup }) => void
  selectedExpiredLockups: number[]
  setSelectedExpiredLockups: (lockups: number[]) => void
}) {
  const { daysLeft, dateStart, dateEnd } = lockup

  const originalDuration = getTimeBetweenDates(dateStart, dateEnd)

  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      if (!selectedExpiredLockups.includes(lockup.id)) {
        setSelectedExpiredLockups([...selectedExpiredLockups, lockup.id])
      }
    } else {
      setSelectedExpiredLockups(
        selectedExpiredLockups.filter((id) => id !== lockup.id)
      )
    }
  }

  const cells = {
    _lockup: { ...lockup, daysLeft },

    select: (
      <Checkbox
        checked={selectedExpiredLockups?.includes(lockup.id)}
        onCheckedChange={handleCheckboxChange}
        className="mt-2"
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

    originalDuration,

    expiredDaysAgo: `${Math.abs(daysLeft)} days ago`,

    actions: (
      <StyledText
        as="button"
        variant="button.secondary"
        className="border-palette-red text-palette-red"
        onClick={onClickEdit.bind(null, { lockup })}
      >
        Refresh
      </StyledText>
    ),
  }

  return cells
}
