import { ComponentProps, useMemo } from "react"
import { twJoin } from "tailwind-merge"

const classNamesByVariant = {
  dangerZone: {
    outerBar: twJoin(
      `bg-palette-red/40 [box-shadow:0_0_10px_theme(colors.palette.red)]`
    ),
    innerBar: twJoin(`animate-pulse bg-palette-red`),
  },
  warningZone: {
    outerBar: twJoin(
      `bg-palette-beige/40 [box-shadow:0_0_10px_theme(colors.palette.beige)]`
    ),
    innerBar: twJoin(`animate-pulse bg-palette-beige`),
  },
  normal: {
    outerBar: twJoin(`bg-palette-green/40`),
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
    <div className={twJoin(`flex items-center gap-6`, className)}>
      <div
        className={twJoin(
          `relative h-4 w-full whitespace-nowrap rounded-full`,
          `overflow-hidden bg-palette-text`
        )}
      >
        <div className={classNamesByVariant[variant].outerBar}>
          <div
            className={twJoin(`absolute inset-1 overflow-hidden rounded-full`)}
          >
            <div
              className={twJoin(
                `absolute inset-0 right-auto`,
                classNamesByVariant[variant].innerBar
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
      <div className={twJoin("whitespace-nowrap text-xs")}>{children}</div>
    </div>
  )
}
