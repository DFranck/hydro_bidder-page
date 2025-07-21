import { Tranche } from "@/app/ts_types/HydroBase.types"
import { StyledText } from "@/components/StyledText"
import { AugmentedLockup } from "@/contract-apis/types"
import { formatAmount } from "@/lib/formatAmount"
import { pluralize } from "@/lib/pluralize"
import { LockupStatus } from "./LockupStatus"
import { DECIMAL_PRECISION_FOR_LOCKING_AMOUNTS } from "@/config"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  CircleSlash2,
  MoreHorizontal,
  RotateCw,
  SquaresUnite,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip } from "@/components/Tooltip"
import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import {
  mergeableDenomTooltip,
  mergeIndicatorTooltip,
} from "@/components/ToolTips"

export function buildActiveRow({
  lockup,
  mergeableLockups,
  selectedActiveLockups,
  initMerge,
  tranches,
  onClickEdit,
  onClickSplit,
  setSelectedActiveLockups,
  findMergeableLockup,
}: {
  lockup: AugmentedLockup
  selectedActiveLockups: number[]
  mergeableLockups: number[]
  initMerge: boolean
  tranches: Tranche[]
  onClickEdit: ({ lockup }: { lockup: AugmentedLockup }) => void
  onClickSplit: ({ lockup }: { lockup: AugmentedLockup }) => void
  setSelectedActiveLockups: (lockups: number[]) => void
  findMergeableLockup: (lockups: number[]) => AugmentedLockup
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

  const MENU_ITEMS = [
    {
      label: "Refresh",
      icon: (
        <RotateCw className="text-palette-green size-2 group-hover:text-white" />
      ),
      cta: (lockup: AugmentedLockup) => onClickEdit({ lockup }),
    },
    {
      label: "Split",
      icon: (
        <CircleSlash2 className="text-palette-green size-2 group-hover:text-white" />
      ),
      cta: (lockup: AugmentedLockup) => onClickSplit({ lockup }),
    },
  ]

  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      if (!selectedActiveLockups.includes(lockup.id)) {
        setSelectedActiveLockups([...selectedActiveLockups, lockup.id])
      }
    } else {
      setSelectedActiveLockups(
        selectedActiveLockups.filter((id) => id !== lockup.id)
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
            checked={selectedActiveLockups?.includes(lockup.id)}
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

    timeLeft: pluralize({
      count: daysLeft,
      prefixCount: true,
      singular: "day",
    }),

    ...statusCells,

    actions: (
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          className="flex justify-start md:justify-end"
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
              className="hover:bg-palette-green/70 group"
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