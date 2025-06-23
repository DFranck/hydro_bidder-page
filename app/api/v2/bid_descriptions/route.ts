import { BidMetaData } from "@/contract-apis/types"

const BID_DESCRIPTIONS_URL =
  "https://raw.githubusercontent.com/informalsystems/hydro-bid-descriptions/refs/heads/main/bid-descriptions.json"

export async function GET() {
  const bidDescriptionsResponse = await fetch(BID_DESCRIPTIONS_URL, {
    headers: {
      Accept: "application/json",
    },
    next: { revalidate: 300 },
  })

  const bidDescriptionsById: Record<string, BidMetaData> =
    await bidDescriptionsResponse.json()

  return Response.json(bidDescriptionsById)
}
