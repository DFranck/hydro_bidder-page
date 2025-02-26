import { BidMetaData } from "@/contract-apis/types"
import "server-only"
import { fetchWithRetry } from "./utils/fetchWithRetry"

export const BID_DESCRIPTIONS_URL =
  "https://raw.githubusercontent.com/informalsystems/hydro-bid-descriptions/refs/heads/main/bid-descriptions.json"

export async function fetchBidMetaDataById(): Promise<
  Record<string, BidMetaData>
> {
  const response = await fetchWithRetry(BID_DESCRIPTIONS_URL, {
    headers: {
      Accept: "application/json",
    },
    next: { revalidate: 86400 }, // 24 hours
  })

  return (await response.json()) as Record<string, BidMetaData>
}
