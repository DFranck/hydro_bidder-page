import { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"

export function TFOOT({
  children,
  className,
  ...otherProps
}: ComponentProps<"tfoot">) {
  return (
    <tfoot
      className={twMerge(
        `
          group/table-footer
          max-sm:block
        `,
        className
      )}
      {...otherProps}
    >
      {children}
    </tfoot>
  )
}
