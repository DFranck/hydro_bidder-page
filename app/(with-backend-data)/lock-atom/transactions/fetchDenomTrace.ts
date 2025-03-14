"use server"

import { endpointsShared } from "@/config"

export async function fetchDenomTrace(balance: {
  denom: string
  amount: string
}) {
  if (balance.denom?.startsWith("ibc/")) {
    try {
      const endpoint = endpointsShared.neutron.rest[0]

      const { url: endpointUrl, headers } = endpoint

      const url = new URL(
        `/ibc/apps/transfer/v1/denom_traces/${balance.denom}`,
        endpointUrl
      )

      const denomTraceResponse = await fetch(url, {
        headers,
      }).then((res) => res.json())
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
