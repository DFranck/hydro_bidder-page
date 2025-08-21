import { useMemo } from "react"
import { DenomOption } from "../utils/buildDenomOptions"

export function useDenomOptionsWithBalances({
  denomOptions,
  balances,
  isConnected,
}: {
  denomOptions: DenomOption[]
  balances: Record<string, string>
  isConnected: boolean
}) {
  return useMemo(() => {
    if (!isConnected) {
      return { withBal: denomOptions, withoutBal: [] as DenomOption[], zeroSet: new Set<string>() }
    }
    const yes: DenomOption[] = []
    const no: DenomOption[] = []
    const zero = new Set<string>()
    for (const o of denomOptions) {
      const amt = balances[o.value] ?? "0"
      if (amt !== "0") yes.push(o)
      else {
        no.push(o)
        zero.add(o.value)
      }
    }
    return { withBal: yes, withoutBal: no, zeroSet: zero }
  }, [denomOptions, balances, isConnected])
}