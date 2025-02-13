import { BidTribute } from "@/components/BidTribute"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
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
      {bid.roundId === currentRoundId ? (
        <StyledText variant="value.positive">
          {bid.tributeAprMin === bid.tributeAprMax
            ? [Infinity, null].includes(bid.tributeAprMin)
              ? `0%`
              : `${formattedTributeAprMin}%`
            : `${formattedTributeAprMin}%\u2009–\u2009${formattedTributeAprMax}%`}
        </StyledText>
      ) : isPending ? (
        <StyledText variant="footnote">Pending</StyledText>
      ) : (
        <StyledText variant="value.positive">
          {(bid.tributeApr * 100).toFixed(2)}%
        </StyledText>
      )}
    </Tooltip>
  )
}
