import { ComponentProps, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

export function BlurryBackdropBox({
  children,
  className,
  ...otherProps
}: ComponentProps<"div"> & {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={twMerge(
        `
          -mx-3
          overflow-hidden
          rounded-md
          bg-palette-text/80
          px-3
          py-2
          backdrop-blur-md
        `,
        className
      )}
      {...otherProps}
    >
      {children}
    </div>
  )
}
