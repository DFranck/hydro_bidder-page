import { BidCard } from "@/app/(v2)/v2/components/BidCard"
import { Icon } from "@/components/Icon"
import { useIsMobile } from "@/lib/useIsMobile"
import { ComponentProps } from "react"
import { twJoin, twMerge } from "tailwind-merge"
import { useDummyData } from "../dummy-data/useDummyData"

export function Bucket({
  bucketId,
  className,
  classNameForViewbox,
  classNameForContentContainer,
  ...otherProps
}: ComponentProps<"div"> & {
  bucketId: number
  classNameForViewbox?: string
  classNameForContentContainer?: string
}) {
  const isMobile = useIsMobile()
  const { buckets, bids, userVotedOnBidIds } = useDummyData()!

  const bucket = buckets.find((bucket) => bucket.id === bucketId)

  if (!bucket) return null

  const { label } = bucket

  const bidsInBucket = bids.filter((bid) => bid.bucketId === bucketId)

  const userVotedInBucket = bidsInBucket.some((bid) =>
    userVotedOnBidIds.includes(bid.id)
  )

  return (
    <div
      id={`bucket-container-${bucketId}`}
      className={twMerge(
        "relative",
        "h-full shrink-0 grow-0",
        "snap-start",
        isMobile ? "w-screen" : "w-[550px]",
        className
      )}
      {...otherProps}
    >
      <div
        id={`bucket-viewbox-${bucketId}`}
        tabIndex={0}
        className={twMerge(
          "absolute inset-0",
          "grid grid-rows-[min-content_auto] gap-[2px]",
          "opacity-80 transition-opacity",
          "border-2 border-transparent",
          "focus-within:border-palette-beige",
          "focus-within:outline-none",
          "focus-within:opacity-100",
          userVotedInBucket && [
            "bg-palette-green/10",
            "scrollbar-thumb-palette-green",
            "scrollbar-track-transparent",
          ],
          classNameForViewbox
        )}
      >
        <div
          id={`bucket-header-${bucketId}`}
          className={twJoin(
            "flex h-12 items-center justify-between px-3",
            userVotedInBucket ? "bg-palette-green/10" : "bg-palette-beige/10"
          )}
        >
          <h2 className="label">{label}</h2>

          <div className={twJoin("flex items-center gap-2")}>
            <span
              className={twJoin(
                "text-xs",
                userVotedInBucket ? "text-palette-green" : "text-palette-beige"
              )}
            >
              {userVotedInBucket
                ? "You voted in this bucket"
                : "There is still time to vote!"}
            </span>

            <button className={twJoin("button")}>
              <Icon name="solid:ellipsis-vertical" />
            </button>
          </div>
        </div>

        <div
          id={`bucket-content-${bucketId}`}
          className={twMerge(
            "h-full",
            "overflow-y-auto",
            "flex flex-col gap-[2px]",
            classNameForContentContainer
          )}
        >
          {bidsInBucket.map(({ id }, index) => (
            <BidCard key={index} bidId={id} />
          ))}

          {!bidsInBucket.length && (
            <div className="empty-box">
              <span>No bids in this bucket, yet&hellip;</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
