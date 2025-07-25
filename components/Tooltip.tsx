"use client"

import {
  ComponentProps,
  FocusEvent,
  MouseEvent,
  ReactNode,
  useRef,
  useState,
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
  const isClient = useIsClient()
  const [shouldRender, setShouldRender] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [isOpen, setIsOpen] = useState(false)
  const timers = useRef<NodeJS.Timeout[]>([])

  if (!isClient) return null

  function updateCoords(element: HTMLDivElement) {
    const targetCoords = element.getBoundingClientRect()
    setCoords({
      x: targetCoords.x + targetCoords.width / 2,
      y:
        targetCoords.y +
        targetCoords.height +
        document.documentElement.scrollTop,
    })
  }

  function handleMouseEnter(event: MouseEvent<HTMLDivElement>) {
    clearTimers()
    setShouldRender(true)
    updateCoords(event.currentTarget)
    timers.current.push(
      setTimeout(() => {
        setIsOpen(true)
      }, mouseEnterDelay),
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
      }, mouseLeaveDelay),
    )
  }

  function handleFocus(event: FocusEvent<HTMLDivElement>) {
    clearTimers()
    updateCoords(event.currentTarget)
    setIsOpen(true)
    setShouldRender(true)
  }

  function handleBlur() {
    clearTimers()
    timers.current.push(
      setTimeout(() => {
        setIsOpen(false)
        setTimeout(() => {
          setShouldRender(false)
        }, 300)
      }, 200),
    )
  }

  function clearTimers() {
    timers.current.forEach((timer) => clearTimeout(timer))
    timers.current = []
  }

  return (
    <div
      className={twMerge(
        `group/tooltip relative z-10 inline-block`,
        // "w-min", poly, 15/05/2025 I disable to keep lockups actions button w-full in new menu design like app\(with-backend-data)\lockups\buildExpiredRow.tsx
        className,
      )}
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
            className={twMerge(
              `
                pointer-events-none
                absolute
                left-1/2
                z-50
                mt-1
                min-w-56
                max-w-96
                -translate-x-1/2
                whitespace-normal
                rounded-sm
                border
                border-palette-beige
                bg-palette-text
                px-4
                py-2
                text-left
                text-sm
                font-normal
                text-white
                opacity-0
                transition-opacity
                duration-300
              `,
              isOpen &&
                `
                  pointer-events-auto
                  translate-y-0
                  opacity-100
                `,
              classNamesForTooltip,
            )}
            style={{
              top: coords.y,
              left: coords.x,
            }}
          >
            {tipContents}
          </div>,
          document.body,
        )}
    </div>
  )
}
