"use server"

import { PreHydroBid } from "@/contract-apis/types"
import { headers } from "next/headers"

export async function fetchPreHydroBidData(): Promise<PreHydroBid[]> {
  const headersList = await headers()
  const requestUrl = new URL(headersList.get("x-url") || "")

  const url = new URL(
    `/data/pre-hydro-bid-deployment-overview-data.json`,
    requestUrl.origin
  )

  console.log(`Fetching pre-hydro bid data from ${url.toString()}`)

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
    },
    next: {
      revalidate: 60 * 60 * 24 * 365, // 1 year
    },
  }).catch((error) => {
    throw new Error(`Failed to fetch pre-hydro bid data: ${error.message}`)
  })

  const preHydroBids = (await response.json()) as PreHydroBid[]

  return preHydroBids
}
