import { ComponentProps } from "react"
import { twJoin, twMerge } from "tailwind-merge"

export function TR({
  children,
  className,
  variant = "tbody",
  ...otherProps
}: ComponentProps<"tr"> & {
  variant?: "tbody" | "thead" | "tfoot"
}) {
  const classNamesByVariant = {
    tbody: twJoin(
      `
        group/table-row
        relative
        odd:bg-palette-beige/5
        max-sm:grid
        max-sm:grid-flow-row
        max-sm:grid-cols-2
        max-sm:gap-6
        max-sm:rounded-md
        max-sm:p-6
        max-sm:hover:bg-palette-beige/10
      `
    ),

    tfoot: twJoin(`
      w-full
      justify-stretch
      max-sm:flex
    `),

    thead: twJoin(`
      w-full
      justify-stretch
      max-sm:flex
    `),
  }

  return (
    <tr
      className={twMerge(classNamesByVariant[variant], className)}
      {...otherProps}
    >
      {children}
    </tr>
  )
}
