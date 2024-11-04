import { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"

export function TBODY({
  children,
  className,
  ...otherProps
}: ComponentProps<"tbody">) {
  return (
    <tbody
      className={twMerge(
        `
          group/table-body
          max-sm:flex
          max-sm:flex-col
          max-sm:gap-3
          max-sm:p-3
        `,
        className
      )}
      {...otherProps}
    >
      {children}
    </tbody>
  )
}
