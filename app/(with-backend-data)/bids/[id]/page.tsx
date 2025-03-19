"use server"

import { BidDetails } from "@/app/(with-backend-data)/bids/[id]/BidDetails"
import { getCompleteBidMetaDataForBidId } from "@/contract-apis/getCompleteBidMetaDataForBidId"

export default async function BidDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const idParam = (await params).id

  const requestedBidId = Number(idParam)

  const bidMetaData = await getCompleteBidMetaDataForBidId({
    bidId: requestedBidId,
  })

  return <BidDetails bidId={requestedBidId} bidMetaData={bidMetaData} />
}
