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
import { CircleSlash2, MoreHorizontal, RotateCw } from "lucide-react"

export function buildActiveRow({
  lockup,
  tranches,
  onClickEdit,
  onClickSplit,
}: {
  lockup: AugmentedLockup
  tranches: Tranche[]
  onClickEdit: ({ lockup }: { lockup: AugmentedLockup }) => void
  onClickSplit: ({ lockup }: { lockup: AugmentedLockup }) => void
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
        <RotateCw className="size-2 text-palette-green group-hover:text-white" />
      ),
      cta: (lockup: AugmentedLockup) => onClickEdit({ lockup }),
    },
    {
      label: "Split",
      icon: (
        <CircleSlash2 className="size-2 text-palette-green group-hover:text-white" />
      ),
      cta: (lockup: AugmentedLockup) => onClickSplit({ lockup }),
    },
  ]

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
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="flex justify-end">
          <StyledText as={"span"} className="cursor-pointer">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </StyledText>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-black ">
          {MENU_ITEMS.map((item) => (
            <DropdownMenuItem
              key={item.label}
              onClick={() => item.cta(lockup)}
              className="group hover:bg-palette-green/70"
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
