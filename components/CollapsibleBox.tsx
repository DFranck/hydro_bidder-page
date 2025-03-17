"use client"

import {
  ComponentProps,
  ElementType,
  TransitionEvent,
  useId,
  useState,
} from "react"
import { twMerge } from "tailwind-merge"

type CollapsibleBoxProps<T extends ElementType = "div"> = ComponentProps<T> & {
  as?: T
  classNamesForInnerWrapper?: string
  isCollapsed?: boolean
  onExpandStart?: () => void
  onExpandEnd?: () => void
  onCollapseStart?: () => void
  onCollapseEnd?: () => void
}

export function CollapsibleBox<T extends ElementType = "div">({
  as,
  children,
  className,
  classNamesForInnerWrapper,
  isCollapsed,
  onExpandStart,
  onExpandEnd,
  onCollapseStart,
  onCollapseEnd,
  ...otherProps
}: CollapsibleBoxProps<T>) {
  const [shouldRenderChildren, setShouldRenderChildren] = useState(!isCollapsed)
  const id = useId()
  const boxId = `js-collapsible-box-${id}`
  const Component = String(as || "div") as ElementType

  const handleTransition = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.currentTarget !== event.target) return
    const { propertyName } = event.nativeEvent
    if (propertyName !== "grid-template-rows") return
    if (event.type === "transitionend") {
      if (isCollapsed) {
        setShouldRenderChildren(false)
        onCollapseEnd?.()
      } else {
        setShouldRenderChildren(true)
        onExpandEnd?.()
      }
    } else {
      setShouldRenderChildren(true)
    }
  }

  const handleTransitionStart = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.currentTarget !== event.target) return
    const { propertyName } = event.nativeEvent
    if (propertyName !== "grid-template-rows") return
    if (isCollapsed) {
      onCollapseStart?.()
    } else {
      onExpandStart?.()
    }
    setShouldRenderChildren(true)
  }

  return (
    <Component
      className={twMerge(
        boxId,
        "grid grid-rows-[0fr] transition-all",
        !isCollapsed && "grid-rows-[1fr]",
        className
      )}
      onTransitionEnd={handleTransition}
      onTransitionStart={handleTransitionStart}
      {...otherProps}
    >
      <div className={twMerge("overflow-hidden", classNamesForInnerWrapper)}>
        {shouldRenderChildren && children}
      </div>
    </Component>
  )
}
