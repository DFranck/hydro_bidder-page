"use server"

import "server-only"

export const BID_DESCRIPTIONS_URL =
  "https://raw.githubusercontent.com/informalsystems/hydro-bid-descriptions/refs/heads/main/bid-descriptions.json"

export interface BidDescriptionFromGithub {
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
  minMaxTargetPolApr?: [min: number, max: number]
}

export type RequestAmount = [amount: number, description: string]

export async function fetchBidDescriptionsById() {
  const response = await fetch(
    `${BID_DESCRIPTIONS_URL}?${new Date().getTime()}`
  )

  return (await response.json()) as Record<string, BidDescriptionFromGithub>
}
