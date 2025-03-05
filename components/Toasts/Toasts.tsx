"use client"

import { ComponentProps } from "react"
import { twJoin, twMerge } from "tailwind-merge"
import { useIsClient } from "usehooks-ts"
import { useToasts } from "./useToasts"

interface ToastsProps extends ComponentProps<"div"> {}

export function Toasts({ children, className, ...otherProps }: ToastsProps) {
  const { toasts } = useToasts()
  const isClient = useIsClient()

  if (!isClient) return null

  return (
    <>
      <div
        className={twMerge(
          "group/toasts-container",
          "overflow-hidden",
          "fixed bottom-6 right-6 z-50 max-h-[calc(100vh-theme(spacing.12))]",
          "flex w-96 flex-col-reverse items-end gap-3",
          "transition-opacity",
          "[&_.js-toast-container]:w-full",
          toasts.length === 0 && "pointer-events-none opacity-0",
          className
        )}
        {...otherProps}
      >
        {children}
      </div>

      <div
        id="toast-corner-shader"
        className={twJoin(
          "pointer-events-none",
          "fixed bottom-0 right-0 z-0",
          "h-[33vh] w-screen",
          "bg-gradient-to-tl from-palette-text via-transparent to-transparent",
          "transition-opacity",
          toasts.length === 0 && "opacity-0"
        )}
      />
    </>
  )
}
