import { useBackendData } from "@/contract-apis/useBackendData"

export function BidStatus({ bidId }: { bidId: number }) {
  const backendData = useBackendData()
  const { bidsById, metricsForPostHydroBids } = backendData
  const bid = bidsById[bidId]

  if (!bid) return null

  const bidInfoFromNumia = metricsForPostHydroBids.find(
    (metric) => Number(metric.id) === bid.id
  )

  if (!bidInfoFromNumia) return null

  const { status } = bidInfoFromNumia

  return status
}
