"use server"

import { BidMetaData } from "@/contract-apis/types"
import { fetchBidMetaDataById } from "./fetchBidMetaDataById"

export async function getCompleteBidMetaDataForBidId({
  bidId,
}: {
  bidId: number
}): Promise<BidMetaData> {
  const bidMetaDataById = await fetchBidMetaDataById()
  return bidMetaDataById[bidId]
}
