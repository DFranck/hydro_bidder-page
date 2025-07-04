"use client"

import { GetStOsmoButtons, skipUrl } from "@/components/GetStOsmoButtons"
import { Icon } from "@/components/Icon"
import { HYDRO_TELEGRAM_COMMUNITY_URL } from "@/config"
import { fetchCurrentRoundId } from "@/contract-apis/fetchCurrentRoundId"
import { useAmountOfStOsmoInWallet } from "@/contract-apis/useAmountOfStOsmoInWallet"
import { useBackendData } from "@/contract-apis/useBackendData"
import { useGlobalLockupCapacityInfo } from "@/contract-apis/useGlobalLockupCapacityInfo"
import { formatOrdinals } from "@/lib/formatOrdinals"
import { useIsDocumentScrolled } from "@/lib/useIsDocumentScrolled"
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
    data: { lockedTokenIsAtCapacityGlobal },
  } = useGlobalLockupCapacityInfo()
  const [currentRoundId, setCurrentRoundId] = useState<number>(
    currentRoundIdFromBackend
  )
  const amountOfStOsmoInWallet = useAmountOfStOsmoInWallet()
  const { isDocumentScrolled: isScrolled } = useIsDocumentScrolled()

  const activeBannerName = lockedTokenIsAtCapacityGlobal
    ? "maxCapacity"
    : process.env.NEXT_PUBLIC_VOTING_TOKEN_NAME === "stOSMO" &&
        amountOfStOsmoInWallet === 0
      ? "getStOsmo"
      : "pilotRounds"

  useEffect(() => {
    if (!currentRoundId) {
      fetchCurrentRoundId().then(setCurrentRoundId)
    }
  }, [currentRoundId])

  const Banners = {
    maxCapacity: {
      href: HYDRO_TELEGRAM_COMMUNITY_URL,
      className: "bg-palette-beige text-palette-text",
      text: (
        <>
          Hydro&rsquo;s current cap has been reached.{" "}
          {JoinOurTelegramGroupForUpdates}
        </>
      ),
    },

    pilotRounds: {
      href: HYDRO_TELEGRAM_COMMUNITY_URL,
      className: "bg-palette-beige text-palette-text",
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

    getStOsmo: {
      href: skipUrl,
      className: "bg-tokens-stosmo text-white",
      text: <GetStOsmoButtons />,
    },
  }

  const { href, text, className } = Banners[activeBannerName]

  return (
    <div
      className={twMerge(
        `
          relative
          text-balance
          bg-palette-beige
          px-3
          text-center
          text-palette-text
          transition-all
          duration-300
          xl:px-24
        `,
        isScrolled ? "py-1.5 text-xs" : "py-2 text-sm",
        className
      )}
    >
      {text}

      <Link className="absolute inset-0 z-10" href={href} target="_blank">
        <span className="sr-only">Learn More</span>
      </Link>
    </div>
  )
}
