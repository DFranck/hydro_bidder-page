'use client'

import { ComponentProps, ElementType } from 'react'
import { twMerge } from 'tailwind-merge'

type CollapsibleBoxProps<T extends ElementType = 'div'> = ComponentProps<T> & {
  as?: T
  isCollapsed?: boolean
}

export function CollapsibleBox<T extends ElementType = 'div'>({
  as,
  children,
  className,
  isCollapsed,
  ...otherProps
}: CollapsibleBoxProps<T>) {
  const Component = String(as || 'div') as ElementType

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
        className,
      )}
      {...otherProps}
    >
      <div className="overflow-hidden">{children}</div>
    </Component>
  )
}
