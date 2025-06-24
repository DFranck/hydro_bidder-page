import { StyledText } from "@/components/StyledText"
import { useBackendData } from "@/contract-apis/useBackendData"
import { getTimeUnitFromNanos } from "@/lib/getTimeUnitFromNanos"
import { pluralize } from "@/lib/pluralize"

export function BidDuration({ bidId }: { bidId: number }) {
  const backendData = useBackendData()
  const { bidsInfo, lockedAtomEpochInNanos } = backendData
  const bid = bidsInfo[bidId]

  const isRejected = bid?.status?.toLowerCase().includes("rejected")

  const { value: durationNumber, unit: durationUnit } = getTimeUnitFromNanos(
    bid.duration * lockedAtomEpochInNanos
  )

  return isRejected ? null : !durationNumber ? (
    <StyledText variant="footnote">No data yet</StyledText>
  ) : (
    pluralize({
      count: durationNumber,
      prefixCount: true,
      singular: durationUnit,
    })
  )
}
