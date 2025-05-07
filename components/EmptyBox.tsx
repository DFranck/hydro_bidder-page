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
          m-3
          rounded-md
          border-2
          border-dashed
          border-palette-beige/20
          p-12
          text-center
          text-white/60
        `,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
