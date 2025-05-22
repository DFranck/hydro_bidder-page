"use client"

import { Icon } from "@/components/Icon"
import { IconString } from "@/components/Icon/types"
import { StyledText } from "@/components/StyledText"
import { useIsMobile } from "@/lib/useIsMobile"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"
import { twJoin, twMerge } from "tailwind-merge"

export interface MenuItem {
  disabled?: boolean
  href?: string
  iconLeft?: IconString
  iconRight?: IconString
  label: ReactNode
  menuItems?: MenuItem[]
  target?: string
  tooltip?: ReactNode
}

export function ResponsiveMenu({
  menuItems,
  className,
  classNameDesktop,
  classNameMobile,
  classNameForBackdropMobile,
  classNameForBackgroundMobile,
  classNameForItemDesktop,
  classNameForItemMobile,
  classNameForSubItemDesktop,
  classNameForSubItemMobile,
  classNameForSubItemsDesktop,
  classNameForSubItemsMobile,
}: {
  menuItems: MenuItem[]
  className?: string
  classNameDesktop?: string
  classNameMobile?: string
  classNameForBackdropMobile?: string
  classNameForBackgroundMobile?: string
  classNameForItemDesktop?: string
  classNameForItemMobile?: string
  classNameForSubItemDesktop?: string
  classNameForSubItemMobile?: string
  classNameForSubItemsDesktop?: string
  classNameForSubItemsMobile?: string
}) {
  const isMobile = useIsMobile()
  const pathname = usePathname()

  function blurActiveElement() {
    ;(document.activeElement as HTMLDivElement)?.blur()
  }

  return (
    <nav
      className={twMerge(
        "group/navbar z-40",
        className,
        isMobile
          ? [
              "pointer-events-none",
              "fixed top-0 right-0 h-full w-2/3 overflow-hidden",
              "transition-all",
              "duration-500",
              "focus-within:pointer-events-auto",
              classNameMobile,
            ]
          : ["relative bg-transparent", classNameDesktop]
      )}
      tabIndex={0}
    >
      <button
        className={twJoin(
          "fixed top-0 right-0 z-40 size-12",
          "flex cursor-pointer",
          "transition-all duration-500",
          "group-focus-within/navbar:rotate-180",
          isMobile ? "pointer-events-auto" : "hidden"
        )}
      >
        <span
          className={twJoin(
            "absolute inset-0 flex items-center justify-center",
            "text-2xl",
            "opacity-100 transition-all duration-500",
            "group-focus-within/navbar:opacity-0"
          )}
        >
          <Icon name="solid:bars" />
        </span>

        <span
          className="
            pointer-events-none
            absolute inset-0 flex items-center justify-center
            text-2xl
            opacity-0 transition-all duration-500
            group-focus-within/navbar:pointer-events-auto
            group-focus-within/navbar:opacity-100
          "
          onClick={blurActiveElement}
        >
          <Icon name="solid:xmark" />
        </span>
      </button>

      {/* Backdrop */}
      <div
        className={twMerge(
          "pointer-events-none",
          "fixed inset-0 z-10",
          "opacity-0",
          "transition-all duration-500",
          "group-focus-within/navbar:pointer-events-auto",
          "group-focus-within/navbar:opacity-100",
          !isMobile && "hidden",
          classNameForBackdropMobile
        )}
        onClick={blurActiveElement}
      />

      {/* Mobile Menu Background */}
      <div
        className={twMerge(
          "pointer-events-none",
          "absolute inset-0 z-20",
          "opacity-0 transition-all duration-500",
          "group-focus-within/navbar:opacity-100",
          !isMobile && "hidden",
          classNameForBackgroundMobile
        )}
      />

      {/* Menu Items */}
      <div
        className={twMerge(
          "relative z-30",
          "flex",
          isMobile
            ? [
                "flex-col justify-between",
                "gap-3 px-6 py-12",
                "opacity-0 transition-all duration-500",
                "group-focus-within/navbar:opacity-100",
              ]
            : "flex-row items-center gap-6"
        )}
      >
        {menuItems.map(
          (
            { label, href, disabled, tooltip, menuItems: subMenuItems },
            index
          ) => {
            const hasMenuItems = !!subMenuItems?.length

            return !hasMenuItems ? (
              <StyledText
                key={href}
                as={Link}
                href={href ?? "#"}
                tooltip={tooltip}
                className={twJoin(
                  disabled && "pointer-events-none opacity-60",
                  isMobile ? classNameForItemMobile : classNameForItemDesktop,
                  pathname?.startsWith(href ?? "") &&
                    "text-palette-beige font-bold"
                )}
                onClick={blurActiveElement}
              >
                {label}
              </StyledText>
            ) : (
              <div
                className={twJoin(
                  "group relative cursor-pointer",
                  "flex flex-col justify-center",
                  isMobile ? "w-full gap-3" : "items-center"
                )}
                key={index}
              >
                <button
                  tabIndex={0}
                  className={twJoin(
                    "flex items-center gap-1",
                    isMobile ? classNameForItemMobile : classNameForItemDesktop
                  )}
                >
                  {label} <Icon name="solid:chevron-down" />
                </button>

                <div
                  className={twJoin(
                    "flex flex-col",
                    "transition-all",
                    isMobile
                      ? classNameForSubItemsMobile
                      : [
                          "absolute top-full z-20",
                          "pointer-events-none opacity-0",
                          "group-has-focus-within:opacity-100",
                          "group-has-focus-within:pointer-events-auto",
                          classNameForSubItemsDesktop,
                        ]
                  )}
                >
                  {subMenuItems.map(
                    ({
                      label,
                      href,
                      disabled = false,
                      target,
                      tooltip = null,
                      iconLeft,
                      iconRight,
                    }) => (
                      <StyledText
                        key={href}
                        as={Link}
                        href={href ?? "#"}
                        target={target}
                        tooltip={tooltip}
                        className={twMerge(
                          disabled && "pointer-events-none opacity-60",
                          "flex w-full items-center justify-between gap-6",
                          "whitespace-nowrap transition-all",
                          isMobile
                            ? classNameForSubItemMobile
                            : classNameForSubItemDesktop
                        )}
                        onClick={blurActiveElement}
                      >
                        <span className="inline-flex items-center gap-2">
                          {iconLeft && <Icon name={iconLeft} />}
                          {label}
                        </span>
                        {iconRight && <Icon name={iconRight} />}
                      </StyledText>
                    )
                  )}
                </div>
              </div>
            )
          }
        )}
      </div>
    </nav>
  )
}
