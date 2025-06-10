import { SourceID } from "@/app/(v2)/v2/environments"
import Image from "next/image"
import { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"

export function SourceBadge({
  sourceId,
  className,
  ...otherProps
}: ComponentProps<"div"> & { sourceId: SourceID }) {
  return (
    <div
      className={twMerge(
        "flex items-center justify-center",
        "shrink-0",
        "rounded-full bg-white leading-0",
        "border-2",
        sourceId === "atom" ? "border-token-atom" : "border-token-stosmo",
        className
      )}
      {...otherProps}
    >
      <div className="relative size-full">
        <div className="absolute inset-0">
          <Image
            src={`/images/token-logo-${sourceId}.svg`}
            alt={sourceId}
            fill={true}
            sizes="10vw"
          />
        </div>
      </div>
    </div>
  )
}
