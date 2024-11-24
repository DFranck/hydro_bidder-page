"use client"

import { Icon } from "@/components/Icon"
import { FocusEvent, MouseEvent, ReactNode, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { twMerge } from "tailwind-merge"
import { useIsClient } from "usehooks-ts"

export function Tooltip({
  children,
  classNamesForTooltip,
  tipContents,
  mouseEnterDelay = 350,
  mouseLeaveDelay = 350,
}: {
  children?: ReactNode
  classNamesForTooltip?: string
  tipContents: ReactNode
  mouseEnterDelay?: number
  mouseLeaveDelay?: number
}) {
  const isClient = useIsClient()
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [isOpen, setIsOpen] = useState(false)
  const timer = useRef<NodeJS.Timeout | null>(null)

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
    if (timer.current) clearTimeout(timer.current)
    updateCoords(event.currentTarget)
    timer.current = setTimeout(() => {
      setIsOpen(true)
    }, mouseEnterDelay)
  }

  function handleMouseLeave() {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setIsOpen(false)
    }, mouseLeaveDelay)
  }

  function handleFocus(event: FocusEvent<HTMLDivElement>) {
    if (timer.current) clearTimeout(timer.current)
    updateCoords(event.currentTarget)
    setIsOpen(true)
  }

  function handleBlur() {
    timer.current = setTimeout(() => {
      setIsOpen(false)
    }, 200)
  }

  return (
    <div
      className="
        group/tooltip
        relative
        z-10
        inline-block
        w-min
      "
      tabIndex={0}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children ?? <Icon name="regular:circle-info" />}
      {createPortal(
        <div
          className={twMerge(
            `
              pointer-events-none
              absolute
              left-1/2
              z-50
              mt-1
              w-56
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
            `,
            isOpen &&
              `
                pointer-events-auto
                translate-y-0
                opacity-100
              `,
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
