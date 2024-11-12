"use client"

import { createContext, ReactNode, useContext } from "react"

interface MetricsContextProps {
  preHydroProposals: ProposalFromNumia[]
}

interface ProposalFromNumia {
  round: string
  tranche: string
  id: string
  project: string
  title: string
  url: string
  onchain_tribute: number
  initial_allocation: number
  current_allocation: number
  duration_days: number
  apr: number
  concluded: string
}

const MetricsContext = createContext<MetricsContextProps | undefined>(undefined)

export const MetricsProvider = ({
  children,
  preHydroProposals,
}: {
  children: ReactNode
  preHydroProposals: ProposalFromNumia[]
}) => {
  return (
    <MetricsContext.Provider value={{ preHydroProposals }}>
      {children}
    </MetricsContext.Provider>
  )
}

export const useMetricsContext = (): MetricsContextProps => {
  const context = useContext(MetricsContext)
  if (!context) {
    throw new Error("useMetrics must be used within a MetricsProvider")
  }
  return context
}
