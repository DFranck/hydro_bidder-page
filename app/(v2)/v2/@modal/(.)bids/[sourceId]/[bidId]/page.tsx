import { BidDetailsModal } from '@v2/components/BidDetailsModal'
import { SourceID } from '@v2/environments'

export default async function BidPage({
  params,
}: {
  params: Promise<{ bidId: string; sourceId: SourceID }>
}) {
  const { bidId, sourceId } = await params

  return <BidDetailsModal sourceId={sourceId} bidId={bidId} />
}
