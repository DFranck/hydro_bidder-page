import { Icon } from "@/components/Icon"
import { ComponentProps } from "react"
import { twJoin } from "tailwind-merge"
import { useDummyData } from "../dummy-data/useDummyData"

export function BidCard({
  bidId,
  ...otherProps
}: ComponentProps<"div"> & { bidId: number }) {
  const { bids, userVotedOnBidIds } = useDummyData()!
  const userHasVotedOnThisBid = userVotedOnBidIds.includes(bidId)
  const bid = bids.find((bid) => bid.id === bidId)

  if (!bid) return null

  const { apr, duration, title } = bid

  return (
    <div
      id="bid-card"
      tabIndex={0}
      className={twJoin(
        "grid grid-cols-[min-content_auto] items-start",
        "gap-3 px-4 pt-3 pb-4",
        "md:gap-6 md:px-6 md:pt-5 md:pb-6",
        "transition-all",
        "border-y-2 border-transparent",
        "focus-within:outline-none",
        "focus-within:border-palette-beige",
        "focus-within:bg-palette-beige",
        "focus-within:text-palette-text",
        "focus-within:**:text-palette-text",
        userHasVotedOnThisBid && [
          "bg-palette-green border-palette-green",
          "text-palette-text **:text-palette-text",
        ]
      )}
      {...otherProps}
    >
      <div
        className={twJoin(
          "mt-1", // slightly nudged down to align with the text
          "size-12 rounded-full",
          "bg-white"
        )}
      />

      <div
        className={twJoin(
          "h-full",
          "flex flex-col justify-between",
          "gap-2 md:gap-4"
        )}
      >
        <h3 className="text-lg">{title}</h3>

        <div
          className={twJoin(
            "flex items-center justify-end gap-6",
            "text-faded text-xs"
          )}
        >
          <div className={twJoin("flex items-center gap-1")}>
            <Icon name="calendar" />
            <span>{duration}</span>
          </div>

          <div className={twJoin("flex items-center gap-1")}>
            <Icon name="chart-line-up" />
            <span>{`${Math.round(apr * 100)}%`}</span>
          </div>

          <button
            className={twJoin(
              "btn-inline btn-inverted",
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
