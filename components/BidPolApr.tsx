import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import { useBackendData } from "@/contract-apis/useBackendData"
import { twJoin } from "tailwind-merge"
import { bidPolAprTooltip } from "./ToolTips"

export function BidPolApr({ bidId }: { bidId: number }) {
  const { bidsInfo, bidMetaDataById, currentRoundId, metricsForPostHydroBids } =
    useBackendData()
  const bid = bidsInfo[bidId]

  if (!bid) return null

  const bidInfoFromGithub = bidMetaDataById[bidId]

  if (bid.roundId === currentRoundId && bidInfoFromGithub?.minMaxTargetPolApr) {
    const [min, max] = bidInfoFromGithub.minMaxTargetPolApr
    const isInfiniteOrNull = [Infinity, null].includes(min)
    const isSameValue = min === max
    const value = isInfiniteOrNull ? 0 : min

    return (
      <StyledText variant="mathSymbol.container">
        <span>{value}</span>
        <StyledText variant="mathSymbol">%</StyledText>
        {!isSameValue && (
          <>
            <StyledText variant="mathSymbol">–</StyledText>
            <span>{max}</span>
            <StyledText variant="mathSymbol">%</StyledText>
          </>
        )}
      </StyledText>
    )
  }

  const bidInfoFromNumia = metricsForPostHydroBids.find(
    (metric) => Number(metric.id) === bid.id
  )

  if (!bidInfoFromNumia)
    return (
      <StyledText variant="footnote" className="whitespace-nowrap">
        No data yet
      </StyledText>
    )

  const {
    apr,
    isOngoing,
    isPending,
    isVoting,
    isRejected,
    currentAllocationAmount,
    initialAllocationAmount,
  } = bidInfoFromNumia

  const isPendingOrVotingOrOngoing =
    isPending || isVoting || (isOngoing && !apr)

  return isRejected ? null : (
    <Tooltip
      tipContents={bidPolAprTooltip({
        isPendingOrVotingOrOngoing,
        currentAllocationAmount,
        initialAllocationAmount,
      })}
      className={twJoin(
        "border-b-2 border-dotted border-white/50 hover:border-white"
      )}
    >
      {isPendingOrVotingOrOngoing ? (
        <StyledText variant="footnote">Pending</StyledText>
      ) : (
        <StyledText variant="mathSymbol.container">
          <span>{apr}</span>
          <StyledText variant="mathSymbol">%</StyledText>
        </StyledText>
      )}
    </Tooltip>
  )
}
