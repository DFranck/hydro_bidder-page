import { StyledText } from "@/components/StyledText"
import { useBackendData } from "@/contract-apis/useBackendData"

export function BidStatus({ bidId }: { bidId: number }) {
  const backendData = useBackendData()
  const { bidsById, metricsForPostHydroBids } = backendData
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

  const { status } = bidInfoFromNumia

  return status
}
