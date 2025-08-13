"use client"

import { createContext, ReactNode, useEffect, useRef, useState } from "react"
import { twJoin } from "tailwind-merge"

export const DropdownContext = createContext<{
  close: () => void
  setDisableClickAway: (b: boolean) => void
}>({
  close: () => {},
  setDisableClickAway: () => {},
})

type DropdownProps = {
  trigger: ReactNode
  className?: string
  children: ReactNode
  onOpenChange?: (open: boolean) => void
  panelClassName?: string
}

export function Dropdown({
  trigger,
  className,
  children,
  onOpenChange,
  panelClassName,
}: DropdownProps) {
  const [open, _setOpen] = useState(false)
  const [disableClickAway, setDisableClickAway] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const setOpen = (next: boolean | ((v: boolean) => boolean)) => {
    _setOpen(prev => {
      const v = typeof next === "function" ? (next as (p: boolean) => boolean)(prev) : next
      if (v !== prev) onOpenChange?.(v) 
      return v
    })
  }

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        open &&
        !disableClickAway &&
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [open, disableClickAway])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <DropdownContext.Provider
      value={{ close: () => setOpen(false), setDisableClickAway }}
    >
      <div ref={ref} className={twJoin("relative inline-block text-left", className)}>
        <button
          type="button" 
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          className="text-palette-green flex items-center gap-1"
        >
          {trigger}
        </button>

        {open && (
          <div
            className={twJoin(
              "absolute top-full right-0 z-20 flex flex-col py-2",
              "bg-palette-text rounded-md border shadow-2xl",
              "text-[14px] text-white transition-opacity",
              "px-1.5",
              panelClassName
            )}
            role="menu"
          >
            {children}
          </div>
        )}
      </div>
    </DropdownContext.Provider>
  )
}
