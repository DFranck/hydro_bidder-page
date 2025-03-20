"use server"

import { sharedEndpoints } from "@/config"
import { fetchWithRetry } from "@/contract-apis/fetchWithRetry"

export async function fetchDenomTrace(balance: {
  denom: string
  amount: string
}) {
  if (balance.denom?.startsWith("ibc/")) {
    try {
      const endpoint = sharedEndpoints.neutron.rest[0]

      const url = new URL(
        `/ibc/apps/transfer/v1/denom_traces/${balance.denom}`,
        endpoint
      ).toString()

      const denomTraceResponse = await fetchWithRetry(url).then((res) =>
        res.json()
      )

      const baseDenom = denomTraceResponse.denom_trace.base_denom

      if (baseDenom?.startsWith("cosmosvaloper")) {
        const [validator, _] = baseDenom?.split("/") ?? []
        return {
          validator,
          amount: balance.amount,
          denom: balance.denom,
          baseDenom,
        }
      }
    } catch (error) {
      console.error(`Error fetching denom trace for ${balance.denom}:`, error)
    }
  }
  return null
}
