import { StyledText } from "@/components/StyledText"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { DECIMAL_PRECISION_FOR_LOCKING_AMOUNTS } from "@/config"
import { AugmentedLockup } from "@/contract-apis/types"
import { formatAmount } from "@/lib/formatAmount"
import { getTimeBetweenDates } from "@/lib/getTimeBetweenDates"
import {
  CircleSlash2,
  MoreHorizontal,
  RotateCw,
  SquaresUnite,
} from "lucide-react"
import { Tooltip } from "@/components/Tooltip"
import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import {
  mergeableDenomTooltip,
  mergeIndicatorTooltip,
} from "@/components/ToolTips"

export function buildExpiredRow({
  lockup,
  mergeableLockups,
  selectedExpiredLockups,
  initMerge,
  onClickEdit,
  onClickSplit,
  setSelectedExpiredLockups,
  findMergeableLockup,
}: {
  lockup: AugmentedLockup
  mergeableLockups: number[]
  selectedExpiredLockups: number[]
  initMerge: boolean
  onClickEdit: ({ lockup }: { lockup: AugmentedLockup }) => void
  onClickSplit: ({ lockup }: { lockup: AugmentedLockup }) => void
  setSelectedExpiredLockups: (lockups: number[]) => void
  findMergeableLockup: (lockups: number[]) => AugmentedLockup
}) {
  const { daysLeft, dateStart, dateEnd } = lockup

  const originalDuration = getTimeBetweenDates(dateStart, dateEnd)

  const MENU_ITEMS = [
    {
      label: "Refresh",
      icon: (
        <RotateCw className="text-palette-red size-2 group-hover:text-white" />
      ),
      cta: (lockup: AugmentedLockup) => onClickEdit({ lockup }),
    },
    {
      label: "Split",
      icon: (
        <CircleSlash2 className="text-palette-red size-2 group-hover:text-white" />
      ),
      cta: (lockup: AugmentedLockup) => onClickSplit({ lockup }),
    },
  ]

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

  const mergePair =
    mergeableLockups.length > 0 &&
    findMergeableLockup(mergeableLockups).funds.denom === lockup.funds.denom

  const cells = {
    _lockup: { ...lockup, daysLeft },

    select: (
      <div className="flex w-10 items-center gap-2">
        <ConditionalWrapper
          condition={initMerge && mergeableLockups.length !== 0 && !mergePair}
          wrapper={(children) => (
            <Tooltip
              classNamesForTooltip="translate-x-1 md:w-96"
              tipContents={mergeableDenomTooltip({
                lockup: {
                  denom: lockup.funds.denomInfo?.humanReadableDenom,
                  validator: lockup.funds.denomInfo?.raw,
                },
                selectedLockup: {
                  denom:
                    findMergeableLockup(mergeableLockups).funds.denomInfo
                      ?.humanReadableDenom,
                  validator:
                    findMergeableLockup(mergeableLockups).funds.denomInfo
                      ?.raw,
                },
              })}
            >
              <div className="pointer-events-none cursor-not-allowed opacity-50">
                {children}
              </div>
            </Tooltip>
          )}
        >
          <Checkbox
            checked={selectedExpiredLockups?.includes(lockup.id)}
            onCheckedChange={handleCheckboxChange}
            disabled={initMerge && mergeableLockups.length !== 0 && !mergePair}
          />
        </ConditionalWrapper>

        {mergePair && initMerge ? (
          <Tooltip
            tipContents={mergeIndicatorTooltip}
            classNamesForTooltip="translate-x-1 md:w-96"
          >
            <SquaresUnite className="size-3.5 animate-pulse" />
          </Tooltip>
        ) : null}
      </div>
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
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          className="flex  justify-start md:justify-end"
        >
          <StyledText as={"span"} className="cursor-pointer">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </StyledText>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-black ">
          {MENU_ITEMS.map((item) => (
            <DropdownMenuItem
              key={item.label}
              onClick={() => item.cta(lockup)}
              className="group text-palette-red hover:bg-palette-red hover:text-white"
            >
              {item.icon}
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  }

  return cells
}