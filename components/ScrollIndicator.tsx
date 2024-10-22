"use client"

import { useIsDocumentScrolled } from "@/lib/useIsDocumentScrolled"
import { ChevronDown } from "lucide-react"
import { twMerge } from "tailwind-merge"

export function ScrollIndicator() {
    const { isDocumentScrolled, canDocumentScroll } = useIsDocumentScrolled()

    return (
        <div
            className={twMerge(
                `
                    pointer-events-none
                    fixed
                    bottom-0
                    left-1/2
                    z-10
                    -translate-x-1/2
                    -translate-y-1/2
                    text-white
                    transition-opacity
                    duration-1000
                `,
                canDocumentScroll && !isDocumentScrolled
                    ? "opacity-100"
                    : "opacity-0"
            )}
        >
            <div
                className="
                    flex
                    size-12
                    items-center
                    justify-center
                    rounded-full
                    bg-palette-green
                    text-palette-text
                "
            >
                <ChevronDown />
            </div>
        </div>
    )
}
