import { ReactNode } from "react"

export function Skeleton({ dummyValue = "..." }: { dummyValue?: ReactNode }) {
  return (
    <div
      className="
        absolute
        inset-0
        w-2/3
        animate-pulse
        rounded
        bg-palette-beige/20
        text-transparent
      "
    >
      {dummyValue}
    </div>
  )
}
