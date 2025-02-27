import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import { bidTableTributeAprTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { twJoin } from "tailwind-merge"

export function BidTributeApr({ bidId }: { bidId: number }) {
  const { bidsById, currentRoundId, metricsForPostHydroBids } = useBackendData()
  const bid = bidsById[bidId]

  if (!bid) return null

  const bidInfoFromNumia = metricsForPostHydroBids.find(
    (metric) => Number(metric.id) === bid.id
  )

  if (!bidInfoFromNumia) {
    return (
      <StyledText variant="footnote" className="whitespace-nowrap">
        No data yet
      </StyledText>
    )
  }

  const { isRejected } = bidInfoFromNumia
  if (isRejected) return null

  const formattedTributeAprMin = (bid.tributeAprMin * 100).toFixed(0)
  const formattedTributeAprMax = (bid.tributeAprMax * 100).toFixed(0)

  const renderAprValue = () => {
    if (bid.roundId === currentRoundId) {
      if (bid.tributeAprMin * 100 > 1000) {
        return (
          <>
            <StyledText variant="mathSymbol">&gt;</StyledText>
            <span>1,000</span>
            <StyledText variant="mathSymbol">%</StyledText>
          </>
        )
      }

      if (bid.tributeAprMin.toFixed(2) === bid.tributeAprMax.toFixed(2)) {
        const value = [Infinity, null].includes(bid.tributeAprMin)
          ? "0"
          : formattedTributeAprMin
        return (
          <>
            <span>{value}</span>
            <StyledText variant="mathSymbol">%</StyledText>
          </>
        )
      }

      return (
        <>
          <span>{formattedTributeAprMin}</span>
          <StyledText variant="mathSymbol">%</StyledText>
          <StyledText variant="mathSymbol">&ndash;</StyledText>
          <span>{formattedTributeAprMax}</span>
          <StyledText variant="mathSymbol">%</StyledText>
        </>
      )
    }

    return (
      <>
        <span>{(bid.tributeApr * 100).toFixed(2)}</span>
        <StyledText variant="mathSymbol">%</StyledText>
      </>
    )
  }

  return (
    <Tooltip
      className={twJoin(
        "inline-flex items-center gap-1",
        "border-b-2 border-dotted border-white/50 hover:border-white"
      )}
      tipContents={bidTableTributeAprTooltip({ bidId })}
    >
      <StyledText variant="mathSymbol.container">{renderAprValue()}</StyledText>
    </Tooltip>
  )
}
