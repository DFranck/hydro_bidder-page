"use client"

import { Icon } from "@/components/Icon"
import { twMerge } from "tailwind-merge"

export default function LoadingState({ isLoading }: { isLoading?: boolean }) {
  return (
    <div
      className={twMerge(
        `
          bg-palette-text
          fixed
          inset-0
          z-30
          flex
          items-center
          justify-center
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
