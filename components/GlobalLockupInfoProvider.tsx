import { GlobalLockupCapacityInfo } from "@/contract-apis/types"
import { createContext, ReactNode, useEffect, useState } from "react"

const defaultValue: GlobalLockupCapacityInfo = {
  lockedTokenTotalGlobal: 0,
  lockedTokenMaxGlobal: 0,
  lockedTokenRemainingCapacityGlobal: 0,
  lockedTokenPercentageGlobal: 0,
  lockedTokenIsAtCapacityGlobal: false,
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
          !data?.rawlockedTokenMaxGlobal
        ) {
          console.error("API error:", data?.error)
          return
        }

        const rawlockedTokenMaxGlobal = Number(data.rawlockedTokenMaxGlobal)
        const totalLockedRaw = Number(data.rawTotalLockedTokens)
        const lockedTokenMaxGlobal = rawlockedTokenMaxGlobal / 1e6
        const lockedTokenTotalGlobal = totalLockedRaw / 1e6
        const lockedTokenRemainingCapacityGlobal = Number(
          (lockedTokenMaxGlobal - lockedTokenTotalGlobal).toFixed(6)
        )
        const lockedTokenPercentageGlobal = Math.floor(
          (lockedTokenTotalGlobal / lockedTokenMaxGlobal) * 100
        )
        const lockedTokenIsAtCapacityGlobal = lockedTokenPercentageGlobal >= 100

        if (isMounted) {
          setGlobalCapacityInfo({
            lockedTokenTotalGlobal,
            lockedTokenMaxGlobal,
            lockedTokenRemainingCapacityGlobal,
            lockedTokenPercentageGlobal,
            lockedTokenIsAtCapacityGlobal,
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
