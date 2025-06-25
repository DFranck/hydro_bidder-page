"use client"

import { TOKEN_DENOMS } from "@/lib/tokenDenoms"
import { WalletStatus } from "@cosmos-kit/core"
import { useChain } from "@cosmos-kit/react"
import { useEffect, useState } from "react"

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
      const balance = await client.getBalance(
        address,
        TOKEN_DENOMS[denom]
      )

      setAmountOfTokenInWallet(Number(balance.amount) / 1e6)
    })().catch(console.error)
  }, [address, status, denom, getStargateClient])

  return amountOfTokenInWallet
}
