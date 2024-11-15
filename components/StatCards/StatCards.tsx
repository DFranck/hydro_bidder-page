import { ContentContainer } from "@/components/ContentContainer"
import { Children, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

export function StatCards({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const childCount = Children.count(children)
  return (
    <div
      className={twMerge(
        `
          bg-gradient-to-t
          from-palette-blue/80
          to-palette-blue/20
          backdrop-blur-md
        `,
        className
      )}
    >
      <ContentContainer
        className={twMerge(
          `
            grid
            grid-cols-1
            items-center
            justify-center
            gap-4
          `,
          childCount % 2 === 0
            ? "sm:grid-cols-2"
            : childCount > 2
              ? "md:grid-cols-3"
              : ""
        )}
      >
        {children}
      </ContentContainer>
    </div>
  )
}
