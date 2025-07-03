import { StyledText } from "@/components/StyledText"
import { useBackendData } from "@/contract-apis/useBackendData"
import Image from "next/image"
import { twJoin } from "tailwind-merge"
import { AtomicBidPairIcon } from "./BidAtomicPairIcon"

export function BidLogoAndTitle({ bidId }: { bidId: number }) {
  const { bidsInfo } = useBackendData()
  const bid = bidsInfo[bidId]

  if (!bid) return null

  const {
    id,
    projectLogoUrl,
    projectName,
    projectTitle,
    title,
    atomic_bid_pair,
    vote_perc,
    trancheId,
  } = bid

  return (
    <BidLogoAndTitleLayout
      projectLogoUrl={projectLogoUrl}
      projectName={projectName}
      title={projectTitle || title}
      atomic_bid_pair={atomic_bid_pair}
      bidInfo={{
        id,
        vote_perc,
        trancheId,
      }}
    />
  )
}

export function BidLogoAndTitleLayout({
  projectLogoUrl,
  projectName,
  title,
  atomic_bid_pair,
  bidInfo,
}: {
  projectLogoUrl?: string
  projectName: string
  title: string
  atomic_bid_pair?: number
  bidInfo?: {
    id: number
    vote_perc: number
    trancheId: number
  }
}) {
  return (
    <div
      id={`#${String(bidInfo?.id)}`}
      className="flex scroll-my-16 items-center gap-3 sm:gap-6"
    >
      <div
        className={twJoin(
          "relative shrink-0",
          "size-8 rounded-full border text-[0]",
          "sm:size-12"
        )}
      >
        {projectLogoUrl ? (
          <Image
            className="object-contain"
            src={projectLogoUrl}
            alt={projectName || title}
            fill={true}
            sizes="(max-width: 639px) 32px, 48px"
          />
        ) : null}
      </div>

      <div className="flex gap-1">
        <StyledText variant="h4" className="max-sm:text-sm">
          {title}
          {atomic_bid_pair && bidInfo?.id ? (
            <AtomicBidPairIcon
              bidInfo={bidInfo}
              atomic_bid_pair={atomic_bid_pair}
            />
          ) : null}
        </StyledText>
      </div>
    </div>
  )
}
