import { useIsMobile } from "@/lib/useIsMobile"
import { ComponentProps, ReactNode } from "react"
import { twJoin, twMerge } from "tailwind-merge"

export function StatBar({
  stats,
  className,
  ...otherProps
}: ComponentProps<"div"> & { stats: [label: ReactNode, value: ReactNode][] }) {
  const isMobile = useIsMobile()

  return (
    <div
      id="stats-bar"
      className={twMerge(
        isMobile ? "gap-1 py-4" : "ml-[2px] h-12 gap-3",
        "flex justify-around",
        "bg-palette-blue",
        className
      )}
      {...otherProps}
    >
      {stats.map(([label, value], index) => (
        <div
          key={index}
          className={twJoin(
            "flex items-center",
            isMobile ? "flex-col justify-center gap-1" : "gap-3"
          )}
        >
          <var className="text-palette-beige text-3xl font-extrabold not-italic">
            {value}
          </var>

          <span className="label text-center">{label}</span>
        </div>
      ))}
    </div>
  )
}
