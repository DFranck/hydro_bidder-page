import { StyledText } from "@/components/StyledText"
import { useBackendData } from "@/contract-apis/useBackendData"
import { pluralize } from "@/lib/pluralize"

export function BidDuration({ bidId }: { bidId: number }) {
  const backendData = useBackendData()
  const { metricsForPostHydroBids } = backendData
  const bidInfoFromNumia = metricsForPostHydroBids.find(
    (metric) => Number(metric.id) === bidId
  )

  if (!bidInfoFromNumia) return null

  const { durationDays, isPending, isRejected } = bidInfoFromNumia

  return isRejected ? null : isPending ? (
    <StyledText variant="footnote">Pending</StyledText>
  ) : !durationDays ? (
    "Pending"
  ) : (
    pluralize({
      count: durationDays,
      prefixCount: true,
      singular: "day",
    })
  )
}
