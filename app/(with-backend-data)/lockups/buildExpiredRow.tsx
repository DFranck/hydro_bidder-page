import { StyledText } from "@/components/StyledText"
import { DECIMAL_PRECISION_FOR_LOCKING_AMOUNTS } from "@/config"
import { AugmentedLockup } from "@/contract-apis/types"
import { formatAmount } from "@/lib/formatAmount"
import { getTimeBetweenDates } from "@/lib/getTimeBetweenDates"

export function buildExpiredRow({
  lockup,
  onClickEdit,
}: {
  lockup: AugmentedLockup
  onClickEdit: ({ lockup }: { lockup: AugmentedLockup }) => void
}) {
  const { daysLeft, dateStart, dateEnd } = lockup

  const originalDuration = getTimeBetweenDates(dateStart, dateEnd)

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
