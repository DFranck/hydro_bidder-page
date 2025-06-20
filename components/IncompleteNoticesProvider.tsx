"use client"

import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useContext,
} from "react"
import { checkForHubLSMShares } from "@/app/(with-backend-data)/lock-atom/transactions/checkForHubLSMShares"
import { IncompleteNotice } from "@/app/(with-backend-data)/lock-atom/types"
import { useChainsAndSigners } from "@/components/ChainsAndSignersProvider"
import { checkForNeutronIncompleteLSMShares } from "@/app/(with-backend-data)/lock-atom/transactions/checkForNeutronIncompleteLSMShares"
import { fetchDenomTrace } from "@/app/(with-backend-data)/lock-atom/transactions/fetchDenomTrace"

interface IncompleteNoticesContextType {
  incompleteNotices: IncompleteNotice[]
  deleteIncompleteNotice: (denom: string, amount: string) => void
}

export const IncompleteNoticesContext = createContext<
  IncompleteNoticesContextType | undefined
>(undefined)

export const IncompleteNoticesProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [incompleteNotices, setIncompleteNotices] = useState<
    IncompleteNotice[]
  >([])
  const { hubChain, neutronChain } = useChainsAndSigners()

  useEffect(() => {
    let cancelled = false

    const fetchInitialNotices = async () => {
      if (!hubChain.address || !neutronChain.address) {
        return
      }

      const [hubShares, neutronIncompleteShares] = await Promise.all([
        checkForHubLSMShares(hubChain),
        checkForNeutronIncompleteLSMShares(neutronChain),
      ])

      if (cancelled) return

      const notices: IncompleteNotice[] = []

      for (const { validator, amount, denom } of hubShares) {
        if (parseInt(amount) >= 100) {
          notices.push({ type: "LSMSharesOnHub", validator, amount, denom })
        }
      }

      for (const { amount, denom } of neutronIncompleteShares) {
        if (parseInt(amount) >= 100) {
          notices.push({
            type: "LSMSharesOnNeutron",
            validator: "",
            amount,
            denom,
          })
        }
      }

      setIncompleteNotices(notices)

      const tracePromises = neutronIncompleteShares.map(fetchDenomTrace)
      const shares = await Promise.all(tracePromises)

      if (cancelled) return

      setIncompleteNotices((prev) =>
        prev
          .map((notice) => {
            if (notice.type === "LSMSharesOnNeutron") {
              const match = shares.find((t) => t?.denom === notice.denom)
              return match
                ? {
                    ...notice,
                    baseDenom: match.baseDenom,
                    validator: match.validator,
                  }
                : notice
            }
            return notice
          })
          .filter((notice) =>
            notice.type === "LSMSharesOnNeutron"
              ? notice.validator !== ""
              : true
          )
      )
    }

    fetchInitialNotices()
    return () => {
      cancelled = true
    }
  }, [hubChain.address, neutronChain.address])

  const deleteIncompleteNotice = (denom: string, amount: string) => {
    setIncompleteNotices((prev) =>
      prev.filter((n) => !(n.denom === denom && n.amount === amount))
    )
  }

  return (
    <IncompleteNoticesContext.Provider
      value={{ incompleteNotices, deleteIncompleteNotice }}
    >
      {children}
    </IncompleteNoticesContext.Provider>
  )
}

export const useIncompleteNotices = () => {
  const context = useContext(IncompleteNoticesContext)
  if (!context) {
    throw new Error(
      "useIncompleteNotices must be used within IncompleteNoticesProvider"
    )
  }
  return context
}
