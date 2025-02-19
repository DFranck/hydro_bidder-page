import { BidDescriptionFromGithub } from "@/contract-apis/types"

export const BID_DESCRIPTIONS_URL =
  "https://raw.githubusercontent.com/informalsystems/hydro-bid-descriptions/refs/heads/main/bid-descriptions.json"

export async function fetchBidDescriptionsById() {
  const response = await fetch(
    `${BID_DESCRIPTIONS_URL}?${new Date().getTime()}`
  )

  return (await response.json()) as Record<string, BidDescriptionFromGithub>
}
