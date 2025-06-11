import { useIsMobile } from "@/lib/useIsMobile"
import { twJoin, twMerge } from "tailwind-merge"

export function StatBar({
  stats,
  className,
  ...otherProps
}: React.ComponentProps<"div"> & {
  stats: [label: React.ReactNode, value: React.ReactNode][]
}) {
  const isMobile = useIsMobile()

  return (
    <div
      id="stats-bar"
      className={twMerge(
        isMobile ? "gap-1 py-4" : "h-18 gap-3",
        "flex justify-around",
        "bg-palette-beige/10 rounded-standard",
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
