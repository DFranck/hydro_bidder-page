"use client"

import { Icon } from "@/components/Icon"
import { HYDRO_TELEGRAM_URL } from "@/config"
import { useBackendData } from "@/contract-apis/useBackendData"
import { formatOrdinals } from "@/lib/formatOrdinals"
import { useIsDocumentScrolled } from "@/lib/useIsDocumentScrolled"
import Link from "next/link"
import { twMerge } from "tailwind-merge"

const JoinOurTelegramGroupForUpdates = (
  <span>
    <a
      href={HYDRO_TELEGRAM_URL}
      className="relative z-20 font-bold underline"
      target="_blank"
    >
      Join our Telegram group for updates <Icon name="solid:arrow-up-right" />
    </a>
  </span>
)

export function AppBanner() {
  const backendData = useBackendData()
  const { currentRoundId, lockedAtomIsAtCapacityGlobal } = backendData
  const { isDocumentScrolled: isScrolled } = useIsDocumentScrolled()
  const activeBannerName = lockedAtomIsAtCapacityGlobal
    ? "maxCapacity"
    : "pilotRounds"

  const Banners = {
    maxCapacity: {
      href: HYDRO_TELEGRAM_URL,
      text: (
        <>
          Hydro's current cap has been reached. {JoinOurTelegramGroupForUpdates}
        </>
      ),
    },
    pilotRounds: {
      href: HYDRO_TELEGRAM_URL,
      text: (
        <>
          Hydro is currently running its{" "}
          <strong>{formatOrdinals(currentRoundId + 1)}</strong> Pilot Round.{" "}
          {JoinOurTelegramGroupForUpdates}
        </>
      ),
    },
  }

  const { href, text } = Banners[activeBannerName]

  return (
    <div
      className={twMerge(
        `
          relative
          bg-palette-beige
          px-24
          text-center
          text-palette-text
          transition-all
          duration-300
        `,
        isScrolled
          ? `
            py-1.5
            text-xs
          `
          : `
            py-2
            text-sm
          `
      )}
    >
      {text}
      <Link className="absolute inset-0 z-10" href={href} target="_blank">
        <span className="sr-only">Learn More</span>
      </Link>
    </div>
  )
}
