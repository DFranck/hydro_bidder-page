import { SourceBadge } from "@/app/(v2)/v2/components/SourceBadge"
import { SourceID } from "@/app/(v2)/v2/environments"
import { Icon } from "@/components/Icon"
import { useIsMobile } from "@/lib/useIsMobile"
import { ComponentProps } from "react"
import { twJoin, twMerge } from "tailwind-merge"
import { ScrollIndicator } from "./ScrollIndicator"

function TrancheNavigationButton({
  className,
  children,
  disabled,
  ...otherProps
}: ComponentProps<"button">) {
  return (
    <button
      className={twMerge(
        "cursor-pointer",
        "h-12 w-full truncate px-3",
        "flex items-center justify-center gap-2",
        "text-palette-text bg-palette-beige",
        "transition-all",
        disabled && "cursor-not-allowed",
        disabled && "opacity-50",
        className
      )}
      {...otherProps}
    >
      {children}
    </button>
  )
}

interface TrancheNavigationProps {
  allTranchesSorted: Array<{
    id: number
    name: string
    sourceId: SourceID
  }>
}

export function TrancheNavigation({
  allTranchesSorted,
}: TrancheNavigationProps) {
  const isMobile = useIsMobile()
  return (
    <ScrollIndicator
      containerSelector="#bid-card-lists"
      targetSelector="[id^='bucket-container-']"
      className={twMerge(
        "overflow-x-auto",
        "w-full gap-[2px]",
        "bg-palette-text/50 backdrop-blur-xs"
      )}
      renderDot={({ index, isActive, spreadProps }) => {
        const tranche = allTranchesSorted[index]
        const { sourceId, name } = tranche
        const userVotedInBucket = false // TODO: add this
        return (
          <TrancheNavigationButton
            key={index}
            className={twJoin(
              isActive && "is-active cursor-default",
              userVotedInBucket && "has-voted",
              "relative",
              "[&:is(.has-voted)]:bg-palette-green/60",
              "[&:not(.has-voted)]:bg-palette-beige",
              "[&:is(.is-active.has-voted,.has-voted:focus-within)]:bg-palette-green",
              "[&:is(.is-active,:focus-within):not(.has-voted)]:bg-palette-beige"
            )}
            {...spreadProps}
          >
            {isMobile ? (
              <Icon name="solid:circle-dashed" />
            ) : (
              <>
                <SourceBadge sourceId={sourceId} className="size-6 p-1" />
                <span className="label">{name}</span>
              </>
            )}

            <div
              className={twJoin(
                "absolute inset-0",
                "bg-gradient-to-t to-transparent",
                sourceId === "atom"
                  ? "from-token-atom to-token-atom/0"
                  : "from-token-stosmo to-token-stosmo/0",
                "opacity-20 transition-opacity",
                isActive && "opacity-40"
              )}
            />

            <div
              className={twJoin(
                "absolute inset-[2px]",
                "border-2",
                "opacity-0 transition-opacity",
                isActive && "opacity-100",
                sourceId === "atom"
                  ? "border-token-atom"
                  : "border-token-stosmo"
              )}
            />
          </TrancheNavigationButton>
        )
      }}
      renderDots={({ dots, onPrevious, onNext, canGoPrevious, canGoNext }) => (
        <>
          <TrancheNavigationButton
            disabled={!canGoPrevious}
            className="w-12 shrink-0"
            onClick={onPrevious}
          >
            <Icon name="solid:chevron-left" />
          </TrancheNavigationButton>

          {dots}

          <TrancheNavigationButton
            disabled={!canGoNext}
            className="w-12 shrink-0"
            onClick={onNext}
          >
            <Icon name="solid:chevron-right" />
          </TrancheNavigationButton>
        </>
      )}
    />
  )
}
