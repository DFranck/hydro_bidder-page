"use client"

import {
  ComponentProps,
  MouseEvent,
  ReactNode,
  useRef,
  useState,
  useLayoutEffect,
} from "react"
import { createPortal } from "react-dom"
import { twMerge } from "tailwind-merge"
import { useIsClient } from "usehooks-ts"

export function Tooltip({
  children,
  className,
  classNamesForTooltip,
  tipContents,
  mouseEnterDelay = 350,
  mouseLeaveDelay = 350,
}: ComponentProps<"div"> & {
  classNamesForTooltip?: string
  tipContents: ReactNode
  mouseEnterDelay?: number
  mouseLeaveDelay?: number
}) {
  const [shouldRender, setShouldRender] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [isOpen, setIsOpen] = useState(false)
  const [showAbove, setShowAbove] = useState(false)

  const tooltipRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef<HTMLDivElement>(null)
  const timers = useRef<NodeJS.Timeout[]>([])

  const isClient = useIsClient()

  function clearTimers() {
    timers.current.forEach((timer) => clearTimeout(timer))
    timers.current = []
  }

  function updateCoords() {
    if (!targetRef.current || !tooltipRef.current) return

    const targetRect = targetRef.current.getBoundingClientRect()
    const tooltipHeight = tooltipRef.current.offsetHeight
    const viewportHeight = window.innerHeight
    const scrollTop = window.scrollY

    const hasSpaceBelow = viewportHeight - targetRect.bottom > tooltipHeight + 8
    const newShowAbove = !hasSpaceBelow

    setShowAbove(newShowAbove)

    setCoords({
      x: targetRect.x + targetRect.width / 2,
      y:
        scrollTop +
        (newShowAbove ? targetRect.top - tooltipHeight : targetRect.bottom),
    })
  }

  function handleMouseEnter(_e: MouseEvent<HTMLDivElement>) {
    clearTimers()
    setShouldRender(true)
    timers.current.push(
      setTimeout(() => {
        setIsOpen(true)
      }, mouseEnterDelay)
    )
  }

  function handleMouseLeave() {
    clearTimers()
    timers.current.push(
      setTimeout(() => {
        setIsOpen(false)
        setTimeout(() => {
          setShouldRender(false)
        }, 300)
      }, mouseLeaveDelay)
    )
  }

  function handleFocus() {
    clearTimers()
    setShouldRender(true)
    setIsOpen(true)
  }

  function handleBlur() {
    clearTimers()
    timers.current.push(
      setTimeout(() => {
        setIsOpen(false)
        setTimeout(() => {
          setShouldRender(false)
        }, 300)
      }, 200)
    )
  }

  useLayoutEffect(() => {
    if (shouldRender) {
      requestAnimationFrame(() => {
        updateCoords()
      })
    }
  }, [shouldRender, isOpen])

  if (!isClient) return null

  return (
    <div
      ref={targetRef}
      className={twMerge("group/tooltip relative z-10 inline-block", className)}
      tabIndex={0}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}

      {shouldRender &&
        createPortal(
          <div
            ref={tooltipRef}
            className={twMerge(
              `
                border-palette-beige
                bg-palette-text
                pointer-events-none
                absolute
                left-1/2
                z-50
                max-w-96
                min-w-56
                -translate-x-1/2
                rounded-sm
                border
                px-4
                py-2
                text-left
                text-sm
                font-normal
                whitespace-normal
                text-white
                opacity-0
                transition-opacity
                duration-300
              `,
              isOpen && "pointer-events-auto opacity-100",
              showAbove ? "mb-1" : "mt-1",
              classNamesForTooltip
            )}
            style={{
              top: coords.y,
              left: coords.x,
            }}
          >
            {tipContents}
          </div>,
          document.body
        )}
    </div>
  )
}
