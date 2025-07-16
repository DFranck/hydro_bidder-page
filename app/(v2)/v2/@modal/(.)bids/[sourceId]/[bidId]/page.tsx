import { BidBrowserModal } from '@v2/components/BidBrowserModal'
import { SourceID } from '@v2/environments'

export default async function BidPage({
  params,
}: {
  params: Promise<{ bidId: string; sourceId: SourceID }>
}) {
  const { bidId, sourceId } = await params

  return <BidBrowserModal sourceId={sourceId} bidId={bidId} />
}
