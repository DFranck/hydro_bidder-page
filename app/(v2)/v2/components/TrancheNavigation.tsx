import { SourceBadge } from "@/app/(v2)/v2/components/SourceBadge"
import { TokenThemeWrapper } from "@/app/(v2)/v2/components/TokenThemeWrapper"
import { SourceID } from "@/app/(v2)/v2/environments"
import { Icon } from "@/components/Icon"
import { useIsMobile } from "@/lib/useIsMobile"
import { twJoin, twMerge } from "tailwind-merge"
import { ScrollIndicator } from "./ScrollIndicator"

function TrancheNavigationButton({
  className,
  children,
  disabled,
  ...otherProps
}: React.ComponentProps<"button">) {
  const isMobile = useIsMobile()
  return (
    <button
      className={twMerge(
        "cursor-pointer",
        "rounded-standard h-full w-full",
        "flex items-center justify-center",
        "transition-all",
        isMobile ? "flex-col gap-1 py-2" : "h-12 gap-2 truncate px-3",
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
        "gap-standard w-full",
        "bg-palette-text/50 backdrop-blur-xs"
      )}
      renderDot={({ index, isActive: isActiveTranche, spreadProps }) => {
        const tranche = allTranchesSorted[index]
        const { sourceId, name } = tranche
        const userVotedInBucket = false // TODO: add this
        return (
          <TokenThemeWrapper
            as={TrancheNavigationButton}
            sourceId={sourceId}
            key={index}
            className={twJoin(
              isActiveTranche && "is-active cursor-default",
              userVotedInBucket && "has-voted",
              "relative justify-between",
              "text-white text-shadow-xs",

              // Not voted
              "border-standard",
              "[&:not(.has-voted)]:border-token-color",
              "[&:is(.is-active,:focus-within):not(.has-voted)]:bg-token-color",

              // Voted
              "[&:is(.has-voted)]:bg-token-color/60",
              "[&:is(.is-active.has-voted,.has-voted:focus-within)]:bg-token-color"
            )}
            {...spreadProps}
          >
            <div className="flex items-center gap-2">
              <SourceBadge sourceId={sourceId} className="size-6 p-1" />
              <span className="label">{name}</span>
            </div>
            <Icon name="solid:circle-dashed" />
          </TokenThemeWrapper>
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
