import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import { bidTableTributeAprTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { twJoin } from "tailwind-merge"

export function BidTributeApr({ bidId }: { bidId: number }) {
  const {
    bidsInfo,
    votingPowerAvailableByTrancheId,
    isWalletConnected,
    votesByRoundId,
    currentRoundId,
  } = useBackendData()
  const bidInfo = bidsInfo[bidId]

  if (!bidInfo) return null

  const {
    apr_tribute,
    totalTokenBasedTributeValue,
    power,
    tokenBasedTributes,
    pointProgramUrl
  } = bidInfo

  const isOnlyPointBased = bidInfo.points && bidInfo.points.length > 0 && bidInfo.tokenBasedTributes.length === 0
  const tributeApr = (apr_tribute ?? 0) * 100

  const formattedTributeAprMin = tributeApr.toFixed(0)

  const votesThisRound = votesByRoundId[currentRoundId] ?? []
  const votesThisTranche = votesThisRound.filter(
    (vote) => bidsInfo[vote.bidId]?.trancheId === bidInfo?.trancheId
  )
  const hasVotedForThisBid = votesThisTranche.some(
    (vote) => vote.bidId === bidId
  )

  const totalVotingPowerOnBid = hasVotedForThisBid
    ? power / 10 ** 6
    : power / 10 ** 6 + votingPowerAvailableByTrancheId[bidInfo.trancheId]

  const tributeAmountByDenom = tokenBasedTributes.reduce(
    (acc, currTribute) => {
      if (!acc[currTribute.denom]) {
        acc[currTribute.denom] = { amount: 0 }
      }
      acc[currTribute.denom].amount += currTribute.amount
      return acc
    },
    {} as { [denom: string]: { amount: number } }
  )

  // add the points based tribute to the tributeAmountByDenom
  if (bidInfo.points && bidInfo.points.length > 0) {
    const pointsDenom = bidInfo.points[1] as string
    const pointsAmount = bidInfo.points[0] as number
    if (!tributeAmountByDenom[pointsDenom]) {
      tributeAmountByDenom[pointsDenom] = { amount: 0 }
    }
    tributeAmountByDenom[pointsDenom].amount += pointsAmount
  }

  const userWillReceiveInUsd = isWalletConnected
    ? (votingPowerAvailableByTrancheId[bidInfo.trancheId] /
        totalVotingPowerOnBid) *
      totalTokenBasedTributeValue
    : 0

  const userWillReceiveInTokens = isWalletConnected
    ? Object.keys(tributeAmountByDenom).map((denom) => {
        return {
          denom,
          valueInTokens:
            (votingPowerAvailableByTrancheId[bidInfo.trancheId] /
              totalVotingPowerOnBid) *
            tributeAmountByDenom[denom]?.amount,
        }
      })
    : [{ denom: "", valueInTokens: 0 }]

  const renderAprValue = () => {
    if (Number.isNaN(tributeApr)) {
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
        {bidInfo.points && bidInfo.points.length > 0 && <StyledText variant="mathSymbol">+</StyledText>}
      </>
    )
  }

  return (
    <Tooltip
      className={twJoin(
        "inline-flex items-center gap-1",
        "border-b-2 border-dotted border-white/50 hover:border-white"
      )}
      tipContents={bidTableTributeAprTooltip({
        bidId,
        hasVotedForThisBid,
        tributeValue: totalTokenBasedTributeValue,
        isWalletConnected,
        userWillReceiveInUsd,
        userWillReceiveInTokens,
        pointProgramUrl,
        isOnlyPointBased
      })}
    >
      <StyledText variant="mathSymbol.container">{renderAprValue()}</StyledText>
    </Tooltip>
  )
}
