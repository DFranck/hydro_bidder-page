"use server"

import { fetchBackendDataBeforeWallet } from "@/contract-apis/fetchBackendDataBeforeWallet"
import { BidMetaData } from "@/contract-apis/types"

export async function getBidDetails({
  bidId,
}: {
  bidId: number
}): Promise<BidMetaData> {
  const { externalData } = await fetchBackendDataBeforeWallet()
  return externalData.bidMetaDataById[bidId]
}
