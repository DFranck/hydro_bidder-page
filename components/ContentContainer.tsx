import { ComponentProps, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

export function ContentContainer({
  children,
  className,
}: ComponentProps<"section"> & { children: ReactNode }) {
  return (
    <div
      className={twMerge(
        `
          container
          mx-auto
          flex
          flex-col
          px-3
          md:px-6
        `,
        className
      )}
    >
      {children}
    </div>
  )
}
