import { Tranche } from "@/app/ts_types/HydroBase.types"
import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { AugmentedLockup } from "@/contract-apis/types"
import { formatAmount } from "@/lib/formatAmount"
import { pluralize } from "@/lib/pluralize"
import { LockupStatus } from "./LockupStatus"
import { DECIMAL_PRECISION_FOR_LOCKING_AMOUNTS } from "@/config"
import { Dropdown } from "./actions/components/Dropdown"
import { LockupActionTrigger } from "./actions/components/LockupActionTrigger"
import { isListedMarketplaceLockup } from "./marketplace/utils/isListedMarketplaceLockup"

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
    }),
  )

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

    timeLeft: pluralize({
      count: daysLeft,
      prefixCount: true,
      singular: "day",
    }),

    ...statusCells,

    actions: (
      <Dropdown
        trigger={<Icon name="light:ellipsis-vertical" />}
        className=" text-gray-500 hover:text-gray-800"
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
