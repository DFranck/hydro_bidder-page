import { Icon } from "@/components/Icon"
import { ComponentProps } from "react"
import { twJoin } from "tailwind-merge"
import { useDummyData } from "../dummy-data/useDummyData"

export function BidCard({
  bidId,
  ...otherProps
}: ComponentProps<"div"> & { bidId: number }) {
  const { bids, userVotedOnBidIds, votingTokens } = useDummyData()!
  const userHasVotedOnThisBid = userVotedOnBidIds.includes(bidId)
  const bid = bids.find((bid) => bid.id === bidId)

  if (!bid) return null

  const { amount, duration, title } = bid

  return (
    <div
      id="bid-card"
      tabIndex={0}
      className={twJoin(
        "grid grid-cols-[min-content_auto]",
        "gap-3 px-4 pt-3 pb-4",
        "items-start",
        "focus-within:outline-none",
        "border-y-2 border-transparent",
        "focus-within:border-palette-beige",
        userHasVotedOnThisBid && ["bg-palette-green/20 border-palette-green"]
      )}
      {...otherProps}
    >
      <div
        className={twJoin(
          "mt-1", // slightly nudged down to align with the text
          "size-12 rounded-full",
          "bg-palette-beige"
        )}
      />

      <div className={twJoin("h-full", "flex flex-col justify-between gap-2")}>
        <h3 className="text-lg">{title}</h3>

        <div
          className={twJoin(
            "flex items-center justify-between gap-2",
            "text-faded text-xs"
          )}
        >
          {(
            [
              ["duration", "calendar", duration],
              ["amount", "dollar-sign", amount],
              [
                "voting status",
                userHasVotedOnThisBid ? "circle-check" : "circle-dashed",
                userHasVotedOnThisBid ? "Change Vote" : "Vote",
              ],
            ] as const
          ).map(([label, icon, value], index) => (
            <div key={index} className="flex items-center gap-1">
              <Icon name={icon} />
              <span>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
