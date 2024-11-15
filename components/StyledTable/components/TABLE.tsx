import { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"

export function TABLE({
  children,
  className,
  propsForWrapper,
  ...otherProps
}: ComponentProps<"table"> & {
  propsForWrapper?: ComponentProps<"div">
}) {
  return (
    <div
      {...propsForWrapper}
      className={twMerge(
        `
          w-full
        `,
        propsForWrapper?.className
      )}
    >
      <table
        className={twMerge(
          `
            group/table
            relative
            box-border
            w-full
            border-separate
            border-spacing-y-1
            max-sm:block
          `,
          className
        )}
        {...otherProps}
      >
        {children}
      </table>
    </div>
  )
}
