"use client"
import { ChainContext } from "@cosmos-kit/core"
import { minimumUATOMGas } from "./_consts"

export async function checkForGasOnHub(hubChain: ChainContext) {
  if (!hubChain.address) {
    throw new Error("Hub chain address not set")
  }

  const restEndpoint = await hubChain.getRestEndpoint()

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
  } = await fetch(
    new URL(
      `cosmos/bank/v1beta1/balances/${hubChain.address}`,
      restEndpointURL
    ).toString(),
    {
      headers: {
        Accept: "application/json",
      },
    }
  ).then((res) => res.json())

  const balances = response.balances
  const uatomBalance = balances.find((b) => b.denom === "uatom")

  const hasEnoughUatom =
    uatomBalance && Number(uatomBalance.amount) > minimumUATOMGas * 2

  return {
    hasEnoughUatom: !!hasEnoughUatom,
    uatomBalance: uatomBalance ? uatomBalance.amount : "0",
  }
}
