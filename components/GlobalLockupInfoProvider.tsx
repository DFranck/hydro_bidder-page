import { GlobalLockupCapacityInfo } from "@/contract-apis/types"
import { createContext, ReactNode, useEffect, useState } from "react"

const defaultValue: GlobalLockupCapacityInfo = {
  lockedAtomTotalGlobal: 0,
  lockedAtomMaxGlobal: 0,
  lockedAtomRemainingCapacityGlobal: 0,
  lockedAtomPercentageGlobal: 0,
  lockedAtomIsAtCapacityGlobal: false,
}

export const GlobalLockupInfoContext =
  createContext<GlobalLockupCapacityInfo>(defaultValue)

interface ProviderProps {
  children: ReactNode
  pollingIntervalMs?: number
}

export const GlobalLockupInfoProvider = ({
  children,
  pollingIntervalMs = 10000,
}: ProviderProps) => {
  const [globalCapacityInfo, setGlobalCapacityInfo] =
    useState<GlobalLockupCapacityInfo>(defaultValue)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        const res = await fetch("/api/total-locked-tokens")
        const data = await res.json()

        if (
          !res.ok ||
          !data?.rawTotalLockedTokens ||
          !data?.rawLockedAtomMaxGlobal
        ) {
          console.error("API error:", data?.error)
          return
        }

        const rawLockedAtomMaxGlobal = Number(data.rawLockedAtomMaxGlobal)
        const totalLockedRaw = Number(data.rawTotalLockedTokens)
        const lockedAtomMaxGlobal = rawLockedAtomMaxGlobal / 1e6
        const lockedAtomTotalGlobal = totalLockedRaw / 1e6
        const lockedAtomRemainingCapacityGlobal = Number(
          (lockedAtomMaxGlobal - lockedAtomTotalGlobal).toFixed(6)
        )
        const lockedAtomPercentageGlobal = Math.floor(
          (lockedAtomTotalGlobal / lockedAtomMaxGlobal) * 100
        )
        const lockedAtomIsAtCapacityGlobal = lockedAtomPercentageGlobal >= 100

        if (isMounted) {
          setGlobalCapacityInfo({
            lockedAtomTotalGlobal,
            lockedAtomMaxGlobal,
            lockedAtomRemainingCapacityGlobal,
            lockedAtomPercentageGlobal,
            lockedAtomIsAtCapacityGlobal,
          })
        }
      } catch (err) {
        console.error("Fetch error:", err)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, pollingIntervalMs)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [pollingIntervalMs])

  return (
    <GlobalLockupInfoContext.Provider value={globalCapacityInfo}>
      {children}
    </GlobalLockupInfoContext.Provider>
  )
}
