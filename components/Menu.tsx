import { Icon } from "@/components/Icon"
import { IconString } from "@/components/Icon/types"
import { ComponentProps, ReactNode } from "react"
import { twMerge } from "tailwind-merge"
interface MenuProps extends ComponentProps<"div"> {
  classNameForPopup?: string
  items: MenuItem[]
}

export interface MenuItem {
  className?: string
  icon?: IconString
  isActive?: boolean
  label: ReactNode
  href?: string
}

export function Menu({
  children,
  className,
  classNameForPopup,
  items,
  ...otherProps
}: MenuProps) {
  return (
    <div
      className={twMerge("group relative inline-block", className)}
      {...otherProps}
    >
      {children}

      <div
        className={twMerge(
          "flex flex-col",
          "transition-all",
          "max-lg:gap-3",
          "absolute",
          "z-50",
          "top-full",
          "-left-10",
          "mt-2",
          "py-2",
          "whitespace-nowrap rounded-md",
          "border",
          "bg-palette-text",
          "shadow-2xl",
          "opacity-0",
          "pointer-events-none",
          "group-has-focus-within:opacity-100",
          "group-has-focus-within:pointer-events-auto",
          classNameForPopup
        )}
      >
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={twMerge(
              "flex items-center gap-2",
              "py-1 pl-3 pr-6",
              "hover:bg-palette-green/20",
              item.isActive && [
                "font-bold",
                "bg-palette-green text-palette-text",
                "hover:bg-palette-green/80",
              ],
              item.className
            )}
            tabIndex={0}
          >
            <Icon
              name={item.icon ?? "solid:circle"}
              className={!item.icon ? "opacity-0" : undefined}
            />
            {item.label}
          </a>
        ))}
      </div>
    </div>
  )
}
