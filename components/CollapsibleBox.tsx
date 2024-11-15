"use client"

import { ComponentProps, ElementType } from "react"
import { twMerge } from "tailwind-merge"

type CollapsibleBoxProps<T extends ElementType = "div"> = ComponentProps<T> & {
  as?: T
  isCollapsed?: boolean
  onCollapseEnd?: () => void
}

export function CollapsibleBox<T extends ElementType = "div">({
  as,
  children,
  className,
  isCollapsed,
  onCollapseEnd,
  ...otherProps
}: CollapsibleBoxProps<T>) {
  const Component = String(as || "div") as ElementType

  function handleCollapseEnd() {
    if (isCollapsed) {
      onCollapseEnd?.()
    }
  }

  return (
    <Component
      className={twMerge(
        `
          grid
          grid-rows-[0fr]
          transition-all
        `,
        !isCollapsed &&
          `
            grid-rows-[1fr]
          `,
        className
      )}
      onTransitionEnd={handleCollapseEnd}
      {...otherProps}
    >
      <div className="overflow-hidden">{children}</div>
    </Component>
  )
}
