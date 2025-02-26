import { RawNumiaBid } from "@/contract-apis/types"
import { fetchWithRetry } from "./utils/fetchWithRetry"

export const typeToTokenMap = {
  "ibc/837E876E": "SWTH",
}

export async function fetchNumiaBidData(): Promise<RawNumiaBid[]> {
  if (!process.env.NUMIA_DEPLOYMENTS_OVERVIEW_ENDPOINT) {
    throw new Error("NUMIA_DEPLOYMENTS_OVERVIEW_ENDPOINT is not set")
  }

  const response = await fetchWithRetry(
    `${process.env.NUMIA_DEPLOYMENTS_OVERVIEW_ENDPOINT}?${new Date().getTime()}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.NUMIA_COSMOS_HYDRO_APP_API_KEY}`,
      },
    }
  ).catch((error) => {
    throw new Error(`Failed to fetch Numia bid data: ${error.message}`)
  })

  const bids = (await response.json()) as RawNumiaBid[]
  return bids
}
