"use client"
import { ChainContext } from "@cosmos-kit/core"
import { UATOMDenom, minimumUATOMGas, minimumUNTRNGas } from "./_consts"

export async function checkForGasOnNeutron(neutronChain: ChainContext) {
  if (!neutronChain.address) {
    throw new Error("Neutron chain address not set")
  }

  const restEndpoint = await neutronChain.getRestEndpoint()

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
    `${restEndpoint}cosmos/bank/v1beta1/balances/${neutronChain.address}`
  ).then((res) => res.json())

  const balances = response.balances
  const untrnBalance = balances.find((b) => b.denom === "untrn")
  const uatomBalance = balances.find((b) => b.denom === UATOMDenom)

  const hasEnoughUntrn =
    untrnBalance && Number(untrnBalance.amount) >= minimumUNTRNGas
  const hasEnoughUatom =
    uatomBalance && Number(uatomBalance.amount) >= minimumUATOMGas

  return {
    hasEnoughUntrn: !!hasEnoughUntrn,
    hasEnoughUatom: !!hasEnoughUatom,
    untrnBalance: untrnBalance ? untrnBalance.amount : "0",
    uatomBalance: uatomBalance ? uatomBalance.amount : "0",
  }
}
