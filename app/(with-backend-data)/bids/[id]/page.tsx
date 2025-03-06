"use server"

import { BidDetails } from "@/components/BidDetails"
import { getBidDetails } from "@/contract-apis/getBidDetails"
import "server-only"

export default async function BidDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const idParam = (await params).id

  const requestedBidId = Number(idParam)

  const bidMetaData = await getBidDetails({
    bidId: requestedBidId,
  })

  return <BidDetails bidId={requestedBidId} bidMetaData={bidMetaData} />
}
