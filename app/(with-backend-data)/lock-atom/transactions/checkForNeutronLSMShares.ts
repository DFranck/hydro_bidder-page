"use client"
import { fetchDenomTrace } from "@/app/(with-backend-data)/lock-atom/transactions/fetchDenomTrace"
import { fetchWithRetry } from "@/contract-apis/utils/fetchWithRetry"
import { SigningStargateClient } from "@cosmjs/stargate"
import { ChainContext } from "@cosmos-kit/core"

export async function checkForNeutronLSMShares(
  neutronChain: ChainContext,
  neutronSigner: SigningStargateClient
) {
  if (!neutronChain.address) {
    throw new Error("Neutron chain address not set")
  }

  const restEndpoint = await neutronChain.getRestEndpoint()

  const response = await fetchWithRetry(
    `${restEndpoint}cosmos/bank/v1beta1/balances/${neutronChain.address}`,
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
    (balance: { denom: string; amount: string }) =>
      fetchDenomTrace(balance, restEndpoint as string)
  )
  const lsmSharesResults = await Promise.all(lsmSharesPromises)
  const lsmShares = lsmSharesResults.filter((share) => share !== null)

  return lsmShares
}
