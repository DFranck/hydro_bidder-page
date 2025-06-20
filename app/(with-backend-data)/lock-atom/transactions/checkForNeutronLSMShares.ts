"use client"

import { fetchDenomTrace } from "@/app/(with-backend-data)/lock-atom/transactions/fetchDenomTrace"
import { fetchWithRetry } from "@/contract-apis/fetchWithRetry"
import { ChainContext } from "@cosmos-kit/core"

export async function checkForNeutronLSMShares(neutronChain: ChainContext) {
  if (!neutronChain.address) {
    throw new Error("Neutron chain address not set")
  }

  const restEndpoint = await neutronChain.getRestEndpoint()

  const restEndpointURL =
    typeof restEndpoint === "string" ? restEndpoint : restEndpoint.url

  const response = await fetchWithRetry(
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

  const lsmSharesPromises: Promise<{
    validator: string
    amount: string
    denom: string
    baseDenom: string
  } | null>[] = response.balances.map(
    (balance: { denom: string; amount: string }) => fetchDenomTrace(balance)
  )
  const lsmSharesResults = await Promise.all(lsmSharesPromises)
  const lsmShares = lsmSharesResults.filter((share) => share !== null)

  return lsmShares
}
