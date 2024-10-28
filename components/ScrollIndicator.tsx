"use client"

import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { useIsDocumentScrolled } from "@/lib/useIsDocumentScrolled"
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
                    transition-opacity
                    duration-1000
                `,
                canDocumentScroll && !isDocumentScrolled
                    ? "opacity-100"
                    : "opacity-0"
            )}
        >
            <StyledText as="div" variant="button.circular.primary">
                <Icon name="solid:chevron-down" />
            </StyledText>
        </div>
    )
}
