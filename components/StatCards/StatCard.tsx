import { Icon } from "@/components/Icon"
import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

export function StatCard({
  isLoading,
  title,
  value,
  subTitle,
}: {
  isLoading?: boolean
  title?: ReactNode
  value?: ReactNode
  subTitle?: ReactNode
}) {
  return (
    <div className="relative">
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

      <div
        className={twMerge(
          `
            flex
            flex-col
            items-center
            opacity-100
            transition-all
          `,
          isLoading && "opacity-0"
        )}
      >
        <h3
          className="
            order-2
            text-base
            font-bold
            xl:text-lg
          "
        >
          {title}
        </h3>
        <div
          className="
            order-3
            text-sm
            font-bold
            text-palette-beige
          "
        >
          {subTitle}
        </div>
        <div
          className="
            font-display
            order-1
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
