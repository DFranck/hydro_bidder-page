import { ComponentProps, useMemo } from "react"
import { twJoin } from "tailwind-merge"

const classNamesByVariant = {
  dangerZone: {
    outerBar: twJoin(
      `
        border-2
        border-palette-red
        bg-palette-red/40
        [box-shadow:0_0_10px_theme(colors.palette.red)]
      `
    ),
    innerBar: twJoin(`animate-pulse bg-palette-red`),
  },
  warningZone: {
    outerBar: twJoin(
      `
        border-2
        border-palette-beige
        bg-palette-beige/40
        [box-shadow:0_0_10px_theme(colors.palette.beige)]
      `
    ),
    innerBar: twJoin(`animate-pulse bg-palette-beige`),
  },
  normal: {
    outerBar: twJoin(
      `
        border-2
        border-palette-green/20
        bg-palette-green/40
      `
    ),
    innerBar: twJoin(`bg-palette-green`),
  },
}

export function ProgressBar({
  className,
  children,
  percentage,
  dangerZone,
  warningZone,
}: ComponentProps<"div"> & {
  percentage: number
  dangerZone?: (percentage: number) => boolean
  warningZone?: (percentage: number) => boolean
}) {
  const variant = useMemo(() => {
    if (dangerZone?.(percentage)) {
      return "dangerZone"
    }
    if (warningZone?.(percentage)) {
      return "warningZone"
    }
    return "normal"
  }, [dangerZone, percentage, warningZone])

  return (
    // Bar + Label
    <div className={twJoin(`flex items-center gap-6`, className)}>
      {/* Wrapper with background to prevent background bleeding through */}
      <div
        className={twJoin(
          `relative h-4 w-full whitespace-nowrap rounded-full`,
          `overflow-hidden bg-palette-text`,
          classNamesByVariant[variant].outerBar
        )}
      >
        {/* An inner bar container with an inset */}
        <div
          className={twJoin(`absolute inset-1 overflow-hidden rounded-full`)}
        >
          {/* The actual bar, styled by variant */}
          <div
            className={twJoin(
              `absolute inset-0 right-auto`,
              classNamesByVariant[variant].innerBar
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className={twJoin("whitespace-nowrap text-xs")}>{children}</div>
    </div>
  )
}
