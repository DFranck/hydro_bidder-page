"use client"

import { Banners } from "@/components/Banners"
import { useBackendData } from "@/contract-apis/useBackendData"
import { useIsDocumentScrolled } from "@/lib/useIsDocumentScrolled"
import Link from "next/link"
import { twMerge } from "tailwind-merge"

export function AppBanner() {
  const backendData = useBackendData()
  const { lockedAtomIsAtCapacityGlobal } = backendData
  const { isDocumentScrolled: isScrolled } = useIsDocumentScrolled()
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
