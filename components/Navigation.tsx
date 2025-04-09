"use client"

import { Icon } from "@/components/Icon"
import { IconString } from "@/components/Icon/types"
import { StyledText } from "@/components/StyledText"
import { needsWalletConnectionTooltip } from "@/components/ToolTips"
import { Wallet } from "@/components/wallet/Wallet"
import { HYDRO_TELEGRAM_ANNOUNCEMENTS_URL, HYDRO_TELEGRAM_COMMUNITY_URL } from "@/config"
import { useBackendData } from "@/contract-apis/useBackendData"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ReactNode, useState } from "react"
import { twJoin } from "tailwind-merge"

interface MenuItem {
  disabled?: boolean
  href?: string
  iconLeft?: IconString
  iconRight?: IconString
  label: ReactNode
  menuItems?: MenuItem[]
  target?: string
  tooltip?: ReactNode
}

export default function Navigation() {
  const pathname = usePathname()
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const backendData = useBackendData()
  const { isWalletConnected } = backendData
  const isActuallyConnected = isWalletConnected || isConnected

  function blurActiveElement() {
    ;(document.activeElement as HTMLDivElement)?.blur()
  }

  const menuItems: MenuItem[] = [
    {
      label: "Bids",
      href: "/bids",
    },
    {
      disabled: !isActuallyConnected,
      label: "Lockups",
      href: "/lockups",
      tooltip: !isActuallyConnected ? needsWalletConnectionTooltip : undefined,
    },
    {
      disabled: !isActuallyConnected,
      label: "Rewards",
      href: "/rewards",
      tooltip: !isActuallyConnected ? needsWalletConnectionTooltip : undefined,
    },
    {
      label: "Metrics",
      href: "/metrics",
    },
    {
      label: "More",
      menuItems: [
        {
          label: "Airdrops",
          href: "/airdrops",
          iconLeft: "solid:parachute-box",
        },
        {
          href: "https://daodao.zone/dao/neutron1lefyfl55ntp7j58k8wy7x3yq9dngsj73s5syrreq55hu4xst660s5p2jtj/proposals",
          iconLeft: "solid:gavel",
          iconRight: "arrow-up-right-from-square",
          label: "Governance",
          target: "_blank",
        },
        {
          href: "/docs",
          iconLeft: "solid:book",
          iconRight: "arrow-up-right-from-square",
          label: "Docs",
          target: "_blank",
        },
        {
          href: "https://x.com/HydroTeam_",
          iconLeft: "brands:x-twitter",
          iconRight: "arrow-up-right-from-square",
          label: "Twitter",
          target: "_blank",
        },
        {
          href: HYDRO_TELEGRAM_COMMUNITY_URL,
          iconLeft: "solid:paper-plane",
          iconRight: "arrow-up-right-from-square",
          label: "Community",
          target: "_blank",
        },
        {
          href: HYDRO_TELEGRAM_ANNOUNCEMENTS_URL,
          iconLeft: "solid:paper-plane",
          iconRight: "arrow-up-right-from-square",
          label: "Announcements",
          target: "_blank",
        },
      ],
    },
  ]

  return (
    <nav
      className="
        group/navbar
        z-40
        max-lg:fixed
        max-lg:right-0
        max-lg:top-0
        max-lg:h-full
        max-lg:w-1/2
        max-lg:overflow-hidden
        max-lg:transition-all
        max-lg:duration-500
        lg:relative
        lg:bg-transparent
        max-lg:pointer-events-none
        max-lg:focus-within:pointer-events-auto
      "
      tabIndex={0}
    >
      <button
        className="
          fixed
          right-0
          top-0
          z-40
          flex
          size-12
          cursor-pointer
          transition-all
          duration-500
          group-focus-within/navbar:rotate-180
          lg:hidden
          max-lg:pointer-events-auto
        "
      >
        <span
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            text-2xl
            opacity-100
            transition-all
            duration-500
            group-focus-within/navbar:opacity-0
          "
        >
          <Icon name="solid:bars" />
        </span>
        <span
          className="
            pointer-events-none
            absolute
            inset-0
            flex
            items-center
            justify-center
            text-2xl
            opacity-0
            transition-all
            duration-500
            group-focus-within/navbar:pointer-events-auto
            group-focus-within/navbar:opacity-100
          "
          onClick={blurActiveElement}
        >
          <Icon name="solid:xmark" />
        </span>
      </button>

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          z-10
          bg-palette-text/20
          opacity-0
          backdrop-blur-md
          transition-all
          duration-500
          group-focus-within/navbar:pointer-events-auto
          group-focus-within/navbar:opacity-100
          lg:hidden
        "
        onClick={blurActiveElement}
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-20
          bg-palette-blue/80
          opacity-0
          transition-all
          duration-500
          group-focus-within/navbar:opacity-100
          lg:hidden
        "
      />

      <div
        className="
          relative
          z-30
          flex
          flex-col
          justify-between
          max-lg:gap-3
          max-lg:px-6
          max-lg:py-12
          max-lg:opacity-0
          max-lg:transition-all
          max-lg:duration-500
          group-focus-within/navbar:max-lg:opacity-100
          lg:flex-row
          lg:items-center
          lg:gap-6
        "
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
                  "hover:text-palette-beige",
                  "max-lg:px-6",
                  pathname?.startsWith(href ?? "") &&
                    "font-bold text-palette-beige"
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
                  "max-lg:w-full",
                  "max-lg:gap-3",
                  "lg:items-center"
                )}
                key={index}
              >
                <button
                  tabIndex={0}
                  className={twJoin(
                    "flex items-center gap-1",
                    "max-lg:px-6",
                    "lg:hover:text-palette-beige",
                    "lg:focus:text-palette-beige"
                  )}
                  onFocus={() => console.log("Focused")}
                  onBlur={() => console.log("Blurred")}
                >
                  {label} <Icon name="solid:chevron-down" />
                </button>

                <div
                  className={twJoin(
                    "flex flex-col",
                    "transition-all",
                    "max-lg:gap-3",
                    "lg:absolute",
                    "lg:z-20",
                    "lg:top-full",
                    "lg:-left-10",
                    "lg:mt-2",
                    "lg:py-2",
                    "lg:rounded-md",
                    "lg:border",
                    "lg:bg-palette-text",
                    "lg:shadow-2xl",
                    "lg:opacity-0",
                    "lg:pointer-events-none",
                    "lg:group-has-[:focus-within]:opacity-100",
                    "lg:group-has-[:focus-within]:pointer-events-auto"
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
                        className={twJoin(
                          disabled && "pointer-events-none opacity-60",
                          "flex w-full items-center justify-between gap-6",
                          "whitespace-nowrap transition-all",
                          "lg:px-4 lg:py-2",
                          "lg:hover:bg-palette-green lg:hover:text-palette-text",
                          "lg:focus:bg-palette-green lg:focus:text-palette-text"
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

        <Wallet notifyConnectedCB={setIsConnected} />
      </div>
    </nav>
  )
}
