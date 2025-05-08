import { StyledText } from "@/components/StyledText"
import { useBackendData } from "@/contract-apis/useBackendData"
import { AmountAndUnitPair } from "./AmountAndUnitPair"

export function BidPolSize({ bidId }: { bidId: number }) {
  const { bidsInfo, metricsForPostHydroBids } = useBackendData()
  const bid = bidsInfo[bidId]

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

  const { currentAllocationAmount, isPending, isVoting } = bidInfoFromNumia

  return isPending || isVoting ? (
    <StyledText variant="footnote">Pending</StyledText>
  ) : !!currentAllocationAmount ? (
    <AmountAndUnitPair
      amount={currentAllocationAmount.toLocaleString(undefined, {
        maximumFractionDigits: 4,
      })}
      unit="ATOM"
    />
  ) : (
    <StyledText variant="footnote" className="whitespace-nowrap">
      &mdash;
    </StyledText>
  )
}
