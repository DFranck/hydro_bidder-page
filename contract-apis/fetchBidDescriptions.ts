import { BidDescriptionFromGithub } from "@/contract-apis/types"
import { fetchWithRetry } from "./utils/fetchWithRetry"

export const BID_DESCRIPTIONS_URL =
  "https://raw.githubusercontent.com/informalsystems/hydro-bid-descriptions/refs/heads/main/bid-descriptions.json"

export async function fetchBidDescriptionsById() {
  const response = await fetchWithRetry(
    `${BID_DESCRIPTIONS_URL}?${new Date().getTime()}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  )

  return (await response.json()) as Record<string, BidDescriptionFromGithub>
}
