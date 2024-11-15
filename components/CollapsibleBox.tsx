"use client"

import { Transition } from "@headlessui/react"
import { ComponentProps, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type CollapsibleBoxProps = ComponentProps<"div"> & {
  children: ReactNode
  isCollapsed?: boolean
  onCollapseEnd?: () => void
}

export function CollapsibleBox({
  className,
  children,
  isCollapsed,
  onCollapseEnd,
  ...otherProps
}: CollapsibleBoxProps) {
  return (
    <Transition appear={true} show={!isCollapsed} afterLeave={onCollapseEnd}>
      <div
        className={twMerge(
          `
            grid
            w-full
            grid-rows-[1fr]
            transition-all
            duration-500
            ease-in-out
            data-[closed]:grid-rows-[0fr]
            data-[closed]:opacity-0
          `,
          className
        )}
        {...otherProps}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </Transition>
  )
}
