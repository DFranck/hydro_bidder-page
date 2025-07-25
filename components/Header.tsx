"use client"

import { AppBanner } from "@/components/AppBanner"
import { ContentContainer } from "@/components/ContentContainer"
import { useIsDocumentScrolled } from "@/lib/useIsDocumentScrolled"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef } from "react"
import { twJoin, twMerge } from "tailwind-merge"
import Navigation from "./Navigation"

export function Header() {
  const { isDocumentScrolled: isScrolled } = useIsDocumentScrolled()
  const elementRef = useRef<HTMLDivElement>(null)
  const ghostElementRef = useRef<HTMLDivElement>(null)

  // Update ghost element height when NOT scrolled (at its tallest)
  useEffect(() => {
    const interval = setInterval(() => {
      if (elementRef.current && ghostElementRef.current) {
        ghostElementRef.current.style.height = `${elementRef.current.clientHeight}px`
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const borderColor =
    process.env.NEXT_PUBLIC_VOTING_TOKEN_NAME === "stOSMO"
      ? "border-tokens-stosmo"
      : "border-tokens-atom"

  return (
    <>
      {/* Ghost element to affect layout despite being fixed */}
      <div ref={ghostElementRef} className="pointer-events-none" />

      <div
        className={twJoin(
          "fixed left-0 right-0 top-0 z-40",
          "border-b",
          "bg-black",
          borderColor,
        )}
        ref={elementRef}
      >
        <ContentContainer
          className={twMerge(
            `
              flex-row
              items-center
              justify-between
              gap-6
              bg-black
              text-sm
              transition-all
              duration-300
            `,
            isScrolled ? `py-1` : `py-3`,
          )}
        >
          <div
            className={twMerge(
              `
                transition-all
                duration-300
              `,
              isScrolled ? `h-8 w-40` : `h-12 w-56`,
            )}
          >
            <Link href="/" className="relative block h-full w-full">
              <Image
                src={"/images/logo.svg"}
                alt="Hydro Logo"
                fill={true}
                className="object-contain"
                sizes="(max-width: 768px) 160px, 224px"
              />
            </Link>
          </div>
          <div className="flex flex-row items-center justify-between gap-6">
            <Navigation />
          </div>
        </ContentContainer>

        <AppBanner />
      </div>
    </>
  )
}
