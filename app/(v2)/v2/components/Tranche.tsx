import { BidCard } from "@/app/(v2)/v2/components/BidCard"
import { SourceBadge } from "@/app/(v2)/v2/components/SourceBadge"
import { TokenThemeWrapper } from "@/app/(v2)/v2/components/TokenThemeWrapper"
import { SourceID } from "@/app/(v2)/v2/environments"
import { useAppState } from "@/app/(v2)/v2/state/provider"
import { Icon } from "@/components/Icon"
import { useIsMobile } from "@/lib/useIsMobile"
import { twJoin, twMerge } from "tailwind-merge"

export function Tranche({
  sourceId,
  trancheId,
  className,
  classNameForViewbox,
  classNameForContentContainer,
  ...otherProps
}: React.ComponentProps<"div"> & {
  sourceId: SourceID
  trancheId: number
  classNameForViewbox?: string
  classNameForContentContainer?: string
}) {
  const isMobile = useIsMobile()
  const { state } = useAppState()
  const { narrowBuckets, currentRoundDataPerSource } = state
  const tranche = currentRoundDataPerSource?.[sourceId].tranches.find(
    (tranche) => tranche.id === trancheId
  )

  if (!tranche) return null

  const { name, metadata } = tranche
  const allBids = currentRoundDataPerSource?.[sourceId].augmentedBids ?? []
  const userVotedInBucket = false // TODO: add this
  const bidsInTranche = allBids.filter((bid) => bid.trancheId === trancheId)

  return (
    <TokenThemeWrapper
      sourceId={sourceId}
      id={`bucket-container-${trancheId}`}
      className={twMerge(
        "relative",
        "h-full shrink-0 grow-0",
        "snap-start",
        isMobile
          ? "w-[calc(100vw-4px)]"
          : narrowBuckets
            ? "w-[550px]"
            : "w-full",
        className
      )}
      {...otherProps}
    >
      <div
        id={`bucket-viewbox-${trancheId}`}
        tabIndex={0}
        className={twMerge(
          "absolute inset-0",
          "gap-standard grid grid-rows-[min-content_auto]",
          "border-2 border-transparent",
          "focus-within:border-token-color",
          "focus-within:outline-none",
          "bg-token-color/10",
          userVotedInBucket && [
            "focus-within:border-token-color",
            "scrollbar-thumb-token-color",
            "scrollbar-track-transparent",
          ],
          classNameForViewbox
        )}
      >
        <div
          id={`bucket-header-${trancheId}`}
          className={twJoin(
            "flex h-12 items-center justify-between px-3",
            userVotedInBucket ? "bg-token-color/10" : "bg-token-color/10"
          )}
        >
          <div className="flex items-center gap-3">
            <SourceBadge sourceId={sourceId} className="size-6 p-1" />
            <h2 className="label">{name}</h2>
          </div>

          <div className={twJoin("flex items-center gap-2")}>
            <span
              className={twJoin(
                "flex items-center gap-1",
                "text-xs",
                userVotedInBucket ? "text-token-color" : "text-token-color"
              )}
            >
              {userVotedInBucket ? (
                <>
                  <span>You voted in this bucket</span>
                  <Icon name="solid:circle-check" />
                </>
              ) : (
                <>
                  <span>You haven&rsquo;t voted in this bucket</span>
                  <Icon name="solid:circle-dashed" />
                </>
              )}
            </span>

            <button className={twJoin("btn-icon")}>
              <Icon name="solid:ellipsis-vertical" />
            </button>
          </div>
        </div>

        <div
          id={`bucket-content-${trancheId}`}
          className={twMerge(
            "h-full",
            "overflow-y-auto",
            classNameForContentContainer
          )}
        >
          <div
            id={`bucket-content-inner-${trancheId}`}
            className={twJoin(
              "gap-standard mx-auto flex flex-col",
              "md:max-w-[60vw]",
              "md:py-12"
            )}
          >
            {bidsInTranche.map((bid, index) => (
              <BidCard key={index} sourceId={sourceId} bidId={bid.id} />
            ))}

            {!bidsInTranche.length && (
              <div className="empty-box">
                <span>No bids in this bucket, yet&hellip;</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </TokenThemeWrapper>
  )
}
