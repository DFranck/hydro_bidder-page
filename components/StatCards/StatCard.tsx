"use client"

import { Icon } from "@/components/Icon"
import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

export function StatCard({
  isLoading,
  title,
  value,
  subTitle,
  className,
}: {
  isLoading?: boolean
  title?: ReactNode
  value?: ReactNode
  subTitle?: ReactNode
  className?: string
}) {
  return (
    <div
      className={twMerge(
        `
          relative
          z-10
          w-full
          p-6
        `,
        className
      )}
    >
      {/* Loading spinner */}
      <div
        className={twMerge(
          `
            pointer-events-none
            absolute
            inset-0
            flex
            items-center
            justify-center
            text-4xl
            opacity-0
            transition-all
          `,
          isLoading && "opacity-100"
        )}
      >
        <Icon className="animate-spin" name="solid:loader" />
      </div>

      {/* Content */}
      <div
        className={twMerge(
          `
            flex
            flex-col-reverse
            items-center
            justify-center
            gap-1
            text-center
            opacity-100
            transition-all
          `,
          isLoading && "opacity-0"
        )}
      >
        <div className="whitespace-nowrap">
          <h3
            className="
              text-sm
              font-bold
              transition-all
              xl:text-base
            "
          >
            {title}
          </h3>
          <div
            className="
              text-xs
              font-bold
              text-palette-beige
              transition-all
              xl:text-sm
            "
          >
            {subTitle}
          </div>
        </div>

        <div
          className="
            font-display
            text-4xl
            font-bold
            text-palette-beige
            xl:text-5xl
          "
        >
          {value}
        </div>
      </div>
    </div>
  )
}
