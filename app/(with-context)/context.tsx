"use client"

import { ToastContextProvider } from "@/components/Toasts"
import { fetchDashboardData } from "@/contract-apis/fetchDashboardData"
import { Validator } from "@/contract-apis/fetchMyValidators"
import { SanitizedProposalFromNumia } from "@/contract-apis/fetchNumiaData"
import { createContext, useContext } from "react"

export type AppContextObject = Awaited<
  ReturnType<typeof fetchDashboardData>
> & {
  numiaData: SanitizedProposalFromNumia[]
  validatorMap: Map<string, Validator>
}

// Define the type for AppContext
export const AppContext: React.Context<AppContextObject | null> =
  createContext<AppContextObject | null>(null)

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useAppContext must be used within a AppProvider")
  }
  return context
}

export function AppContextProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: AppContextObject
}) {
  return (
    <AppContext.Provider value={{ ...value }}>
      <ToastContextProvider>{children}</ToastContextProvider>
    </AppContext.Provider>
  )
}
