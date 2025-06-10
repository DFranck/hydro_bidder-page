import { SourceID } from "@/app/(v2)/v2/environments"
import { useAppState } from "@/app/(v2)/v2/state/provider"
import { Icon } from "@/components/Icon"
import Image from "next/image"
import { ComponentProps } from "react"
import { twJoin } from "tailwind-merge"

export function BidCard({
  sourceId,
  bidId,
  ...otherProps
}: ComponentProps<"div"> & {
  sourceId: SourceID
  bidId: number
}) {
  const { state } = useAppState()
  const { currentRoundDataPerSource, bidDescriptionsById } = state
  const userVotedOnBidIds: number[] = []
  const userHasVotedOnThisBid = userVotedOnBidIds.includes(bidId)
  const augmentedBids =
    currentRoundDataPerSource?.[sourceId]?.augmentedBids ?? []
  const bid = augmentedBids?.find((bid) => bid.id === bidId)

  if (!bid) return null

  const bidDescription = bidDescriptionsById[bidId]

  return (
    <div
      id="bid-card"
      tabIndex={0}
      className={twJoin(
        "grid grid-cols-[min-content_auto] items-center",
        "gap-3 px-4 pt-3 pb-4",
        "md:gap-6 md:px-6 md:pt-5 md:pb-6",
        "transition-all",
        "focus-within:outline-none",
        "focus-within:bg-palette-beige",
        "focus-within:text-palette-text",
        "focus-within:**:text-palette-text",
        "hover:bg-palette-beige/20",
        "hover:**:text-white",
        "focus-within:hover:bg-palette-beige/90",
        "focus-within:hover:**:text-palette-text",
        userHasVotedOnThisBid && [
          "bg-palette-green",
          "hover:bg-palette-green/50",
          "text-palette-text **:text-palette-text",
        ]
      )}
      {...otherProps}
    >
      <div className={twJoin("size-12 rounded-full")}>
        {bidDescription?.projectLogoUrl && (
          <Image
            src={bidDescription.projectLogoUrl}
            alt={bidDescription.projectName ?? bidDescription.title}
            width={48}
            height={48}
          />
        )}
      </div>

      <div
        className={twJoin(
          "flex items-center justify-between",
          "gap-2 md:gap-4"
        )}
      >
        <h3 className="text-lg">{bid.title}</h3>

        <div
          className={twJoin(
            "flex items-center justify-end gap-6",
            "text-faded text-xs"
          )}
        >
          <div className={twJoin("flex items-center gap-1")}>
            <Icon name="calendar" />
            <span>{bid.duration}</span>
          </div>

          <div className={twJoin("flex items-center gap-1")}>
            <Icon name="chart-line-up" />
            <span>??%</span>
          </div>

          <button
            className={twJoin(
              "btn-primary btn-inline btn-inverted",
              "flex items-center gap-1"
            )}
          >
            <Icon
              name={userHasVotedOnThisBid ? "circle-check" : "circle-dashed"}
            />
            <span>{userHasVotedOnThisBid ? "Change Vote" : "Vote"}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
