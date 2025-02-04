"use client"

import { Icon } from "@/components/Icon"
import { useBackendData } from "@/contract-apis/useBackendData"
import { useIsDocumentScrolled } from "@/lib/useIsDocumentScrolled"
import Link from "next/link"
import { twMerge } from "tailwind-merge"

export function Banner() {
  const backendData = useBackendData()
  const { currentRoundId, lockedAtomIsAtCapacityGlobal } = backendData
  const { isDocumentScrolled: isScrolled } = useIsDocumentScrolled()
  const Banners = {
    maxCapacity: {
      href: "/docs#max-capacity",
      text: (
        <>
          Current round caps have been reached. Continue optimizing
          your vote to maximize your rewards!{" "}
          <span className="inline-flex items-center gap-1 font-bold underline">
            Learn More <Icon name="solid:arrow-up-right" />
          </span>
        </>
      ),
    },
    pilotRounds: {
      href: "/docs#pilot-rounds",
      text: (
        <>
          Hydro is currently running pilot rounds.{" "}
          <span className="inline-flex items-center gap-1 font-bold underline">
            Learn More <Icon name="solid:arrow-up-right" />
          </span>
        </>
      ),
    },
  }
  const activeBannerName = lockedAtomIsAtCapacityGlobal
    ? "maxCapacity"
    : "pilotRounds"
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
