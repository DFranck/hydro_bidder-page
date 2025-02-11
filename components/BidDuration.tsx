import { StyledText } from "@/components/StyledText"
import { useBackendData } from "@/contract-apis/useBackendData"
import { getTimeUnitFromNanos } from "@/lib/getTimeUnitFromNanos"
import { pluralize } from "@/lib/pluralize"

export function BidDuration({ bidId }: { bidId: number }) {
  const backendData = useBackendData()
  const { bidsById, metricsForPostHydroBids } = backendData
  const bidInfoFromNumia = metricsForPostHydroBids.find(
    (metric) => Number(metric.id) === bidId
  )
  const bid = bidsById[bidId]

  const { isPending, isRejected } = bidInfoFromNumia ?? {}

  const { value: durationNumber, unit: durationUnit } = getTimeUnitFromNanos(
    bid.deploymentDurationInNanos
  )

  return isRejected ? null : isPending || !durationNumber ? (
    <StyledText variant="footnote">Pending</StyledText>
  ) : (
    pluralize({
      count: durationNumber,
      prefixCount: true,
      singular: durationUnit,
    })
  )
}
