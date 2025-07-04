import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { DECIMAL_PRECISION_FOR_LOCKING_AMOUNTS } from "@/config"
import { AugmentedLockup } from "@/contract-apis/types"
import { formatAmount } from "@/lib/formatAmount"
import { getTimeBetweenDates } from "@/lib/getTimeBetweenDates"
import { Dropdown } from "./actions/components/Dropdown"
import { LockupActionTrigger } from "./actions/components/LockupActionTrigger"
import { isListedMarketplaceLockup } from "./marketplace/utils/isListedMarketplaceLockup"

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
      <Dropdown
        trigger={<Icon name="light:ellipsis-vertical" />}
        className="text-gray-500 hover:text-gray-800"
      >
        {isListedMarketplaceLockup(lockup) && (
          <LockupActionTrigger lockup={lockup} action="unlist" />
        )}
        <LockupActionTrigger lockup={lockup} action="list" />
        <LockupActionTrigger lockup={lockup} action="transfer" />
        <button
          className="flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-palette-green hover:text-palette-text"
          onClick={onClickEdit.bind(null, { lockup })}
        >
          <Icon name="light:rotate" />
          Refresh
        </button>
      </Dropdown>
    ),
  }

  return cells
}
