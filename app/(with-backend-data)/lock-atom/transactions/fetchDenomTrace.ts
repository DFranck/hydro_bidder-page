"use server"

import { getEndpoints } from "@/config"
import { fetchWithRetry } from "@/contract-apis/fetchWithRetry"

export async function fetchDenomTrace(balance: {
  denom: string
  amount: string
}) {
  if (balance.denom?.startsWith("ibc/")) {
    try {
      const endpoint = getEndpoints({
        environmentVariables: {
          NUMIA_COSMOS_HYDRO_APP_API_KEY:
            process.env.NUMIA_COSMOS_HYDRO_APP_API_KEY!,
        },
      }).neutron.rpc[0]

      const url = `${endpoint.url.replace(/\/$/, "")}/ibc/apps/transfer/v1/denom_traces/${balance.denom}`

      const denomTraceResponse = await fetchWithRetry(url, {
        headers: endpoint.headers,
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
