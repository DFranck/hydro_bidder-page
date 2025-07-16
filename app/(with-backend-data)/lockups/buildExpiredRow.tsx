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
import { CircleSlash2, MoreHorizontal, RotateCw } from "lucide-react"

export function buildExpiredRow({
  lockup,
  onClickEdit,
  onClickSplit,
  selectedExpiredLockups,
  setSelectedExpiredLockups,
}: {
  lockup: AugmentedLockup
  onClickEdit: ({ lockup }: { lockup: AugmentedLockup }) => void
  onClickSplit: ({ lockup }: { lockup: AugmentedLockup }) => void
  selectedExpiredLockups: number[]
  setSelectedExpiredLockups: (lockups: number[]) => void
}) {
  const { daysLeft, dateStart, dateEnd } = lockup

  const originalDuration = getTimeBetweenDates(dateStart, dateEnd)

  const MENU_ITEMS = [
    {
      label: "Refresh",
      icon: (
        <RotateCw className="size-2 text-palette-red group-hover:text-white" />
      ),
      cta: (lockup: AugmentedLockup) => onClickEdit({ lockup }),
    },
    {
      label: "Split",
      icon: (
        <CircleSlash2 className="size-2 text-palette-red group-hover:text-white" />
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
