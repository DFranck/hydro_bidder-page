import { StargateClient } from "@cosmjs/stargate"
import { useEffect, useState } from "react"

export type UseAccountBalancesParams = {
  isOpened: boolean
  address?: string
  getStargateClient: () => Promise<Pick<StargateClient, "getAllBalances">>
}

export function useAccountBalances({ isOpened, address, getStargateClient }: UseAccountBalancesParams) {
  const [balances, setBalances] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (!isOpened || !address) return
      setLoading(true)
      try {
        const client = await getStargateClient()
        const all = await client.getAllBalances(address)
        if (cancelled) return
        const map: Record<string, string> = {}
        for (const c of all) map[c.denom] = c.amount
        setBalances(map)
      } catch (e) {
        console.error("[useAccountBalances] balances error:", e)
        if (!cancelled) setBalances({})
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [isOpened, address, getStargateClient])

  return { balances, loading }
}
