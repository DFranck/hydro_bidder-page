import { BidTribute } from "@/components/BidTribute"
import { BidTributeApr } from "@/components/BidTributeApr"
import { useBackendData } from "@/contract-apis/useBackendData"

export function BidTributeAprOrPoints({ bidId }: { bidId: number }) {
  const { bidMetaDataById } = useBackendData()
  const bidDescription = bidMetaDataById[bidId] ?? {}
  const { points = [] } = bidDescription

  return points.length > 0 ? (
    <BidTribute bidId={bidId} />
  ) : (
    <BidTributeApr bidId={bidId} />
  )
}
