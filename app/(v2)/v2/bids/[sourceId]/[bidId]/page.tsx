import { AppPageContainer } from '@v2/components/AppPageContainer'
import { BidDetails } from '@v2/components/BidDetails'
import { SourceID } from '@v2/environments'

export default async function BidsRoundPage({
  params,
}: {
  params: Promise<{ sourceId: SourceID; bidId: string }>
}) {
  const { sourceId, bidId } = await params

  return (
    <AppPageContainer className="h-full">
      <BidDetails
        sourceId={sourceId}
        bidId={parseInt(bidId)}
        className="rounded-standard h-full overflow-hidden"
      />
    </AppPageContainer>
  )
}
