"use server"

export interface BidDescription {
  title: string
  aboutProject?: string
  description: string
  projectLogoUrl?: string
  projectName: string
  projectUrl: string
  committeeComments?: string
  requestAmount: RequestAmount[]
  points?: RequestAmount
  pointProgramUrl?: string
  appendix?: string
  // not available for all proposals (soft deprecated but still used)
  projectType?: string
}

export type RequestAmount = [amount: number, description: string]

export async function fetchBidDescriptionsById() {
  const response = await fetch(
    "https://raw.githubusercontent.com/informalsystems/hydro-bid-descriptions/refs/heads/main/bid-descriptions.json"
  )

  return (await response.json()) as Record<string, BidDescription>
}
