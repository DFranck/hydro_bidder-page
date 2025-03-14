"use client"
import { SigningStargateClient } from "@cosmjs/stargate"
import { ChainContext } from "@cosmos-kit/core"

// TODO: unlock and move tokens from this contract after the lock is complete
// const hydroContractAddress =
//     "neutron192s005pfsx7j397l4jarhgu8gs2lcgwyuntehp6wundrh8pgkywqgss0tm"

export async function checkForHubLSMShares(
  hubChain: ChainContext,
  hubSigner: SigningStargateClient
) {
  if (!hubChain.address) {
    throw new Error("Hub chain address not set")
  }

  const restEndpoint = await hubChain.getRestEndpoint()

  const [restEndpointUrl, headers] =
    typeof restEndpoint === "string"
      ? [restEndpoint, {}]
      : [restEndpoint.url, restEndpoint.headers]

  const url = new URL(
    `/cosmos/bank/v1beta1/balances/${hubChain.address}`,
    restEndpointUrl
  )

  const response: {
    balances: {
      denom: string
      amount: string
    }[]
    pagination: {
      next_key: string | null
      total: string
    }
  } = await fetch(url, { headers }).then((res) => res.json())

  const lsmShares = response.balances
    .filter((balance) => balance.denom?.startsWith("cosmosvaloper"))
    .map((balance) => {
      const [validator, _] = balance.denom?.split("/") ?? []
      return {
        validator,
        amount: balance.amount,
        denom: balance.denom,
      }
    })

  return lsmShares
}
