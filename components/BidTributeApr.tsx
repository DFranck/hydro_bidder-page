import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import { bidTableTributeAprTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { twJoin } from "tailwind-merge"

export function BidTributeApr({ bidId }: { bidId: number }) {
  const backendData = useBackendData()
  const { bidsById, currentRoundId, metricsForPostHydroBids } = backendData
  const bid = bidsById[bidId]

  if (!bid) return null

  const bidInfoFromNumia = metricsForPostHydroBids.find(
    (metric) => Number(metric.id) === bid.id
  )

  if (!bidInfoFromNumia)
    return (
      <StyledText variant="footnote" className="whitespace-nowrap">
        No data yet
      </StyledText>
    )

  const { isPending, isRejected } = bidInfoFromNumia

  const formattedTributeAprMin = (bid.tributeAprMin * 100).toFixed(0)
  const formattedTributeAprMax = (bid.tributeAprMax * 100).toFixed(0)

  return isRejected ? null : (
    <Tooltip
      className={twJoin(
        "inline-flex items-center gap-1",
        "border-b-2 border-dotted border-white/50 hover:border-white"
      )}
      tipContents={bidTableTributeAprTooltip({ bidId })}
    >
      {bid.roundId === currentRoundId ? (
        <span className="whitespace-nowrap">
          {bid.tributeAprMin === bid.tributeAprMax
            ? [Infinity, null].includes(bid.tributeAprMin)
              ? `0%`
              : `${formattedTributeAprMin}%`
            : `${formattedTributeAprMin}%\u2009–\u2009${formattedTributeAprMax}%`}
        </span>
      ) : isPending ? (
        <StyledText variant="footnote">Pending</StyledText>
      ) : (
        <span className="whitespace-nowrap">
          {(bid.tributeApr * 100).toFixed(2)}%
        </span>
      )}
    </Tooltip>
  )
}
