import { BidMetaDataById } from "../../../contract-apis/types"

export const BID_DESCRIPTIONS_URL =
  "https://raw.githubusercontent.com/informalsystems/hydro-bid-descriptions/refs/heads/main/bid-descriptions.json"

export type RequestAmount = [amount: number, description: string]

export async function fetchBidDescriptionsById() {
  const response = await fetch(
    `${BID_DESCRIPTIONS_URL}?time=${new Date().getTime()}`
  )

  return (await response.json()) as BidMetaDataById
}
