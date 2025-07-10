import { useBackendData } from "@/contract-apis/useBackendData"
import { Tooltip } from "./Tooltip"
import { atomicBidPairToolTip } from "./ToolTips"
import { Link2 } from "lucide-react"
import { voteThresholdByTrancheId } from "@/config"

export function AtomicBidPairIcon({
  bidInfo,
  atomic_bid_pair,
}: {
  bidInfo: {
    id: number
    vote_perc: number
    trancheId: number
  }
  atomic_bid_pair: number
}) {
  const { bidsInfo } = useBackendData()
  const bid = bidsInfo[atomic_bid_pair]

  if (!bid) return

  const { projectTitle, title, vote_perc, trancheId } = bid

  const voteThresholdAtomicPair =
    voteThresholdByTrancheId[trancheId as keyof typeof voteThresholdByTrancheId]

  const voteThresholdBidInfo =
    voteThresholdByTrancheId[
      bidInfo.trancheId as keyof typeof voteThresholdByTrancheId
    ]

  const isBelowThreshold =
    bidInfo.vote_perc < voteThresholdBidInfo ||
    vote_perc < voteThresholdAtomicPair

  return (
    <span
      className="mx-1 cursor-pointer"
      onClick={(e) => {
        e.preventDefault()

        const element = document.getElementById(`#${String(atomic_bid_pair)}`)
        element?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      }}
    >
      <Tooltip
        tipContents={atomicBidPairToolTip({
          bidId: atomic_bid_pair,
          bidTitle: projectTitle || title,
          isBelowThreshold
        })}
        classNamesForTooltip="w-64 md:-ml-24 md:w-96"
      >
        <Link2 className="mt-1 size-4 text-palette-green" />
      </Tooltip>
    </span>
  )
}
