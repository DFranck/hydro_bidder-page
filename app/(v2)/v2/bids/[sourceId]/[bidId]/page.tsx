import { AppPageContainer } from '@v2/components/AppPageContainer'
import { BidBrowser } from '@v2/components/BidBrowser'
import { SourceID } from '@v2/environments'

export default async function BidsRoundPage({
  params,
}: {
  params: Promise<{ sourceId: SourceID; bidId: string }>
}) {
  const { sourceId, bidId } = await params

  return (
    <AppPageContainer className="h-full">
      <BidBrowser
        sourceId={sourceId}
        bidId={parseInt(bidId)}
        isModal={false}
        className="rounded-standard"
      />
    </AppPageContainer>
  )
}
