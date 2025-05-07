import { StyledText } from "@/components/StyledText"
import { ReactNode } from "react"
import { twJoin } from "tailwind-merge"

export function TableHeader({
  leftSlot,
  rightSlot,
}: {
  leftSlot: ReactNode
  rightSlot: ReactNode
}) {
  return (
    <div
      className={twJoin(
        "flex items-center justify-between",
        "flex-col sm:flex-row",
        "gap-3",
        "rounded-t-md bg-palette-beige/20",
        "-mx-2 -my-1 px-6 py-3",
        "transition-all",
        "group-has-[.js-collapsible-table-content[data-collapsed]]:rounded-b-md",
      )}
    >
      <StyledText variant="h4">{leftSlot}</StyledText>

      <div
        className={twJoin(
          "flex flex-row-reverse items-center gap-6",
          "text-xs max-sm:w-full",
        )}
      >
        {rightSlot}
      </div>
    </div>
  )
}
