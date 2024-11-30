"use client"

import { Icon } from "@/components/Icon"
import { useIsLoadingNewRoute } from "@/lib/useIsLoadingNewRoute"
import { twMerge } from "tailwind-merge"

export default function LoadingState() {
  const isLoading = useIsLoadingNewRoute()

  return (
    <div
      className={twMerge(
        `
          fixed
          inset-0
          z-50
          flex
          items-center
          justify-center
          bg-palette-text
          text-2xl
          text-white
          transition-opacity
        `,
        isLoading
          ? `
            pointer-events-auto
            opacity-100
            duration-500
          `
          : `
            pointer-events-none
            opacity-0
            duration-100
          `
      )}
    >
      <div className="animate-spin">
        <Icon name="solid:loader" />
      </div>
    </div>
  )
}
