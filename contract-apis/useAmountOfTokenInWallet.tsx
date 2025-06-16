"use client"

import { WalletStatus } from "@cosmos-kit/core"
import { useChain } from "@cosmos-kit/react"
import { useEffect, useState } from "react"

export function useAmountOfTokenInWallet() {
  const [amountOfStOsmoInWallet, setAmountOfStOsmoInWallet] = useState(0)
  const { address, status, getStargateClient } = useChain("neutron")

  useEffect(() => {
    if (!address || status !== WalletStatus.Connected) return
    ;(async () => {
      const neutronStOsmoDenom = process.env.NEXT_PUBLIC_NEUTRON_STOSMO_DENOM

      if (!neutronStOsmoDenom) {
        throw new Error("NEXT_PUBLIC_NEUTRON_STOSMO_DENOM is not set")
      }

      const client = await getStargateClient()
      const balance = await client.getBalance(address, neutronStOsmoDenom)

      setAmountOfStOsmoInWallet(Number(balance.amount) / 1e6)
    })().catch(console.error)
  }, [address, status, getStargateClient])

  return amountOfStOsmoInWallet
}
