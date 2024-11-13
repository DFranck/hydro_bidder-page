import { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"

export function THEAD({
  children,
  className,
  ...otherProps
}: ComponentProps<"thead">) {
  return (
    <thead
      className={twMerge(
        `
          group/table-header
          max-sm:block
        `,
        className
      )}
      {...otherProps}
    >
      {children}
    </thead>
  )
}
