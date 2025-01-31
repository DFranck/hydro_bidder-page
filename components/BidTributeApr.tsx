import { BidTribute } from "@/components/BidTribute"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import { useBackendData } from "@/contract-apis/useBackendData"
import { twJoin } from "tailwind-merge"

export function BidTributeApr({ bidId }: { bidId: number }) {
  const backendData = useBackendData()
  const { bidsById, metricsForPostHydroBids } = backendData
  const bid = bidsById[bidId]

  if (!bid) return null

  const bidInfoFromNumia = metricsForPostHydroBids.find(
    (metric) => Number(metric.id) === bid.id
  )

  if (!bidInfoFromNumia) return null

  const { isPending, isRejected } = bidInfoFromNumia

  return isRejected ? null : (
    <Tooltip
      tipContents={
        <div className="flex flex-col">
          <StyledText variant="label">Tribute Size</StyledText>
          <BidTribute bid={bid} textAlign="left" />
        </div>
      }
      className={twJoin(
        "inline-flex items-center gap-1",
        "border-b-2 border-dotted border-white/50 hover:border-white"
      )}
      classNamesForTooltip="w-fit"
    >
      {isPending ? (
        <StyledText variant="footnote">Pending</StyledText>
      ) : (
        <span>{(bid.tributeApr * 100).toFixed(2)}%</span>
      )}
    </Tooltip>
  )
}
