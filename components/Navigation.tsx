"use client"

import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { needsWalletConnectionTooltip } from "@/components/ToolTips"
import { Wallet } from "@/components/wallet/Wallet"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { twMerge } from "tailwind-merge"

export default function Navigation() {
  const pathname = usePathname()
  const [isConnected, setIsConnected] = useState<boolean>(false)

  const navigationMenuTriggerStyle = (link: string) => {
    return twMerge(
      `
        block
        text-sm
        font-medium
        leading-tight
        tracking-tight
        text-white
        hover:text-palette-beige
        focus:bg-transparent
        focus:text-palette-beige
        max-lg:w-full
        max-lg:justify-center
        max-lg:py-3
        max-lg:text-center
      `,
      pathname?.startsWith(link) ? "font-bold text-palette-beige" : ""
    )
  }

  function blurActiveElement() {
    ;(document.activeElement as HTMLDivElement)?.blur()
  }

  return (
    <nav
      className="
        group/navbar
        z-40
        max-lg:fixed
        max-lg:right-0
        max-lg:top-0
        max-lg:h-12
        max-lg:w-12
        max-lg:overflow-hidden
        max-lg:transition-all
        max-lg:duration-500
        max-lg:focus-within:size-auto
        max-lg:focus-within:h-full
        max-lg:focus-within:w-1/2
        lg:relative
        lg:bg-transparent
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
          items-center
          justify-between
          max-lg:py-12
          max-lg:indent-96
          max-lg:transition-all
          max-lg:duration-500
          max-lg:group-focus-within/navbar:indent-0
          lg:flex-row
          lg:gap-6
        "
        onClick={blurActiveElement}
      >
        <Link
          href="/docs"
          target="_blank"
          className={twMerge(
            navigationMenuTriggerStyle("/docs"),
            `flex items-center gap-1`,
            `md:border-r-2 lg:border-palette-beige/50 lg:pr-5`
          )}
        >
          Docs <Icon name="solid:arrow-up-right" />
        </Link>

        <Link href="/bids" className={navigationMenuTriggerStyle("/bids")}>
          Bids
        </Link>

        <ConditionalWrapper
          condition={!isConnected}
          wrapper={(children) => (
            <Tooltip tipContents={needsWalletConnectionTooltip}>
              {children}
            </Tooltip>
          )}
        >
          <Link
            href="/lockups"
            className={twMerge(
              navigationMenuTriggerStyle("/lockups"),
              !isConnected && "pointer-events-none opacity-60"
            )}
          >
            Lockups
          </Link>
        </ConditionalWrapper>

        <ConditionalWrapper
          condition={!isConnected}
          wrapper={(children) => (
            <Tooltip tipContents={needsWalletConnectionTooltip}>
              {children}
            </Tooltip>
          )}
        >
          <Link
            href="/rewards"
            className={twMerge(
              navigationMenuTriggerStyle("/rewards"),
              !isConnected && "pointer-events-none opacity-60"
            )}
          >
            Rewards
          </Link>
        </ConditionalWrapper>

        <Link
          href={"/metrics"}
          className={navigationMenuTriggerStyle("/metrics")}
        >
          Metrics
        </Link>

        <Link
          href="/airdrops"
          className={navigationMenuTriggerStyle("/airdrops")}
        >
          Airdrops
        </Link>

        <Wallet notifyConnectedCB={setIsConnected} />
      </div>
    </nav>
  )
}
