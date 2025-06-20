"use client"

import { fetchWithRetry } from "@/contract-apis/fetchWithRetry"
import { ChainContext } from "@cosmos-kit/core"

export async function checkForNeutronIncompleteLSMShares(
  neutronChain: ChainContext
) {
  if (!neutronChain.address) {
    throw new Error("Neutron chain address not set")
  }

  const restEndpoint = await neutronChain.getRestEndpoint()
  const restEndpointURL =
    typeof restEndpoint === "string" ? restEndpoint : restEndpoint.url

  const response: {
    balances: {
      denom: string
      amount: string
    }[]
    pagination: {
      next_key: string | null
      total: string
    }
  } = await fetchWithRetry(
    new URL(
      `cosmos/bank/v1beta1/balances/${neutronChain.address}`,
      restEndpointURL
    ).toString(),
    {
      headers: {
        Accept: "application/json",
      },
    }
  ).then((res) => res.json())

  return response.balances.filter((balance: { denom: string }) =>
    balance.denom?.startsWith("ibc/")
  )
}
