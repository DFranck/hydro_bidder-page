export const BID_DESCRIPTIONS_URL =
  "https://raw.githubusercontent.com/informalsystems/hydro-bid-descriptions/refs/heads/main/bid-descriptions.json"

export interface BidDescription {
  aboutProject?: string
  appendix?: string
  committeeComments?: string
  description: string
  pointProgramUrl?: string
  points?: RequestAmount
  projectLogoUrl?: string
  projectName: string
  projectUrl: string
  requestAmount: RequestAmount[]
  title: string
  // not available for all proposals (soft deprecated but still used)
  projectType?: string
}

export type RequestAmount = [amount: number, description: string]

export async function fetchBidDescriptionsById() {
  const response = await fetch(BID_DESCRIPTIONS_URL)

  return (await response.json()) as Record<string, BidDescription>
}
