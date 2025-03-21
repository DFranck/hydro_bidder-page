import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import { bidTableTributeAprTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { twJoin } from "tailwind-merge"

export function BidTributeApr({ bidId }: { bidId: number }) {
  const { bidsById, bidsInfo, currentRoundId, metricsForPostHydroBids } =
    useBackendData()
  const bid = bidsById[bidId]
  const bidInfo = bidsInfo[bidId]

  if (!bid) return null

  const { apr_tribute } = bidInfo

  const tributeApr = apr_tribute ?? 0

  const formattedTributeAprMin = tributeApr.toFixed(0)

  console.log({
    tributeApr,
    formattedTributeAprMin,
  })

  const renderAprValue = () => {
    if (Number.isNaN(tributeApr) || bidInfo.points?.length > 0) {
      return (
        <>
          <span>0</span>
          <StyledText variant="mathSymbol">%</StyledText>
        </>
      )
    }

    if (tributeApr > 1000) {
      return (
        <>
          <StyledText variant="mathSymbol">&gt;</StyledText>
          <span>1,000</span>
          <StyledText variant="mathSymbol">%</StyledText>
        </>
      )
    }

    return (
      <>
        <span>{formattedTributeAprMin}</span>
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
