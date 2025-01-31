import { StyledText } from "@/components/StyledText"
import { useBackendData } from "@/contract-apis/useBackendData"
import { AmountAndUnitPair } from "./AmountAndUnitPair"

export function BidPolSize({ bidId }: { bidId: number }) {
  const backendData = useBackendData()
  const { bidsById, metricsForPostHydroBids } = backendData
  const bid = bidsById[bidId]

  if (!bid) return null

  const bidInfoFromNumia = metricsForPostHydroBids.find(
    (metric) => Number(metric.id) === bid.id
  )

  if (!bidInfoFromNumia) return null

  const { currentAllocationAmount, isPending } = bidInfoFromNumia

  return isPending ? (
    <StyledText variant="footnote">Pending</StyledText>
  ) : !!currentAllocationAmount ? (
    <AmountAndUnitPair
      amount={currentAllocationAmount.toLocaleString(undefined, {
        maximumFractionDigits: 4,
      })}
      unit="ATOM"
    />
  ) : null
}
