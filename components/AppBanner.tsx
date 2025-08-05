"use client"

import { Icon } from "@/components/Icon"
import { HYDRO_TELEGRAM_COMMUNITY_URL } from "@/config"
import { fetchCurrentRoundId } from "@/contract-apis/fetchCurrentRoundId"
import { useBackendData } from "@/contract-apis/useBackendData"
import { useGlobalLockupCapacityInfo } from "@/contract-apis/useGlobalLockupCapacityInfo"
import { formatOrdinals } from "@/lib/formatOrdinals"
import Link from "next/link"
import { useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"

const JoinOurTelegramGroupForUpdates = (
  <span>
    <a
      href={HYDRO_TELEGRAM_COMMUNITY_URL}
      className="relative z-20 font-bold underline"
      target="_blank"
    >
      Join our Telegram group for updates <Icon name="solid:arrow-up-right" />
    </a>
  </span>
)

export function AppBanner() {
  const backendData = useBackendData()
  const { currentRoundId: currentRoundIdFromBackend } = backendData
  const {
    data: { lockedAtomIsAtCapacityGlobal },
  } = useGlobalLockupCapacityInfo()
  const [currentRoundId, setCurrentRoundId] = useState<number>(
    currentRoundIdFromBackend
  )
  const activeBannerName = lockedAtomIsAtCapacityGlobal
    ? "maxCapacity"
    : "pilotRounds"

  useEffect(() => {
    if (!currentRoundId) {
      fetchCurrentRoundId().then(setCurrentRoundId)
    }
  }, [currentRoundId])

  const Banners = {
    maxCapacity: {
      href: HYDRO_TELEGRAM_COMMUNITY_URL,
      text: (
        <>
          Hydro&rsquo;s current cap has been reached.{" "}
          {JoinOurTelegramGroupForUpdates}
        </>
      ),
    },
    pilotRounds: {
      href: HYDRO_TELEGRAM_COMMUNITY_URL,
      text: !currentRoundId ? (
        "Loading..."
      ) : (
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
          bg-palette-beige
          text-palette-text
          relative
          px-3
          text-center
          text-balance
          transition-all
          duration-300
          xl:px-24
        `,
        "py-2 text-sm"
      )}
    >
      {text}

      <Link className="absolute inset-0 z-10" href={href} target="_blank">
        <span className="sr-only">Learn More</span>
      </Link>
    </div>
  )
}
