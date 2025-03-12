"use server"

import { TrackingItem } from "./types"

const TRACKING_HOLDINGS_ENDPOINT =
  "https://hydro-deployment-tracking-2fitd.ondigitalocean.app/holdings/"

export async function fetchTracking() {
  try {
    const response = await fetch(TRACKING_HOLDINGS_ENDPOINT).then((res) =>
      res.json()
    )
    return response as TrackingItem[]
  } catch (error) {
    console.error(error)
  }
}
