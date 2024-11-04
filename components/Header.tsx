"use client"

import { ContentContainer } from "@/components/ContentContainer"
import { Icon } from "@/components/Icon"
import { useUserVotingData } from "@/hooks/hooks"
import { useIsDocumentScrolled } from "@/lib/useIsDocumentScrolled"
import { useChain } from "@cosmos-kit/react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useDeferredValue, useEffect } from "react"
import { twMerge } from "tailwind-merge"
import Navigation from "./Navigation"

export const Header = () => {
  const { isDocumentScrolled: isScrolled } = useIsDocumentScrolled()
  const { address } = useChain("neutron")
  const previousAddress = useDeferredValue(address)
  const { data: userVotingData } = useUserVotingData(address || "")
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const hasRedirected = window.sessionStorage.getItem("redirected") === "true"

    if (!previousAddress && !!address && !hasRedirected) {
      window.sessionStorage.setItem("redirected", "true")
      router.push("/voting")
    }

    if (!address && !!previousAddress && hasRedirected) {
      window.sessionStorage.setItem("redirected", "false")
      router.push("/voting")
    }
  }, [address, pathname, router, previousAddress])

  return (
    <div
      className="
        sticky
        left-0
        right-0
        top-0
        z-50
        border-b
        border-palette-beige
      "
    >
      <ContentContainer
        className={twMerge(
          `
            flex-row
            items-center
            justify-between
            bg-black
            text-sm
            transition-all
            duration-300
          `,
          isScrolled
            ? `
              py-1
            `
            : `
              py-3
            `
        )}
      >
        <div
          className={twMerge(
            `
              relative
              transition-all
              duration-300
            `,
            isScrolled
              ? `
                  h-8
                  w-40
                `
              : `
                  h-12
                  w-56
                `
          )}
        >
          <Link href="/">
            <Image src={"/images/logo.svg"} alt="twitter" fill={true} />
          </Link>
        </div>
        <div className="flex flex-row items-center justify-between gap-6">
          <Navigation />
        </div>
      </ContentContainer>

      <div
        className={twMerge(
          `
            relative
            bg-palette-green
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
        Hydro is currently in view-only mode.{" "}
        <span className="inline-flex items-center gap-1 font-bold underline">
          Learn More <Icon name="solid:arrow-up-right" />
        </span>
        <Link className="absolute inset-0 z-10" href="/docs" target="_blank">
          <span className="sr-only">Learn More</span>
        </Link>
      </div>
    </div>
  )
}
