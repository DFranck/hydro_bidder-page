"use client"

import { WalletStatus } from "@cosmos-kit/core"
import { useChain } from "@cosmos-kit/react"
import { useEffect, useState } from "react"

export const configDenom = {
  tokenDenom: {
    dATOM:
      "factory/neutron1k6hr0f83e7un2wjf29cspk7j69jrnskk65k3ek2nj9dztrlzpj6q00rtsa/udatom",
    stATOM:
      "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9",
      // "ibc/B7864B03E1B9FD4F049243E92ABD691586F682137037A9F3FCA5222815620B3C",
  },
}

export function useAmountOfTokenInWallet(denom: "stATOM" | "dATOM") {
  const [amountOfTokenInWallet, setAmountOfTokenInWallet] = useState(0)
  const { address, status, getStargateClient } = useChain("neutron")

  useEffect(() => {
    if (!address || status !== WalletStatus.Connected) return
    ;(async () => {
      if (!denom) {
        throw new Error("Denom is not set")
      }

      const client = await getStargateClient()
      const balance = await client.getBalance(address, configDenom.tokenDenom[denom])

      setAmountOfTokenInWallet(Number(balance.amount) / 1e6)
    })().catch(console.error)
  }, [address, status, denom, getStargateClient])

  return amountOfTokenInWallet
}
