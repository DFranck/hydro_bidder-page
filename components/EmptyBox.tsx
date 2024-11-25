import { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"

export function EmptyBox({
  children,
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={twMerge(
        `
          my-3
          rounded-md
          border-dashed
          border-palette-beige/20
          py-12
          text-center
          text-white/60
        `,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
