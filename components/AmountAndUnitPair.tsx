import { ReactNode } from "react"
import { twJoin } from "tailwind-merge"

export function AmountAndUnitPair({
  amount,
  unit,
  textAlign = "left",
}: {
  amount: ReactNode
  unit: ReactNode
  textAlign?: "left" | "center" | "right"
}) {
  return (
    <div
      className={twJoin(
        "flex w-full items-baseline gap-1",
        textAlign === "left" && "justify-start",
        textAlign === "center" && "justify-center",
        textAlign === "right" && "justify-end"
      )}
    >
      {amount}
      <span
        className={twJoin(
          "inline-flex items-center gap-1",
          "text-sm opacity-60"
        )}
      >
        {unit}
      </span>
    </div>
  )
}
