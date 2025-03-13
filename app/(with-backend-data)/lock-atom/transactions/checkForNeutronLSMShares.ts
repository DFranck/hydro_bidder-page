"use client"

import { fetchDenomTrace } from "@/app/(with-backend-data)/lock-atom/transactions/fetchDenomTrace"
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

  const response = await fetch(
    `${restEndpoint}cosmos/bank/v1beta1/balances/${neutronChain.address}`
  ).then((res) => res.json())

  const lsmSharesPromises: Promise<{
    validator: string
    amount: string
    denom: string
    baseDenom: string
  } | null>[] = response.balances.map(
    (balance: { denom: string; amount: string }) =>
      fetchDenomTrace(balance, String(restEndpoint))
  )
  const lsmSharesResults = await Promise.all(lsmSharesPromises)
  const lsmShares = lsmSharesResults.filter((share) => share !== null)

  return lsmShares
}
