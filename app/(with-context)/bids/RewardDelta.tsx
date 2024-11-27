import { Icon } from "@/components/Icon"
import { twMerge } from "tailwind-merge"

export function RewardDelta({
  deltaPercentage,
}: {
  deltaPercentage: number | null
}) {
  if (deltaPercentage === null || deltaPercentage === 0) return null

  const isPositive = deltaPercentage > 0
  return (
    <span
      className={twMerge(
        "flex items-center gap-1 text-xs",
        isPositive ? "text-palette-green" : "text-palette-red"
      )}
    >
      <Icon name={isPositive ? "solid:arrow-up" : "solid:arrow-down"} />
      {Math.round(deltaPercentage * 100)}%
    </span>
  )
}
