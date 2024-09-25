"use client"

import { fetchDashboardData } from "@/app/dashboard/getData"
import { createContext, useContext } from "react"

export type ProposalsContextObject = Awaited<
    ReturnType<typeof fetchDashboardData>
> & {
    totalTributeValue: number
    atomPrice: number
}

export const ProposalsContext = createContext<ProposalsContextObject | null>(
    null
)

export function useProposalsContext() {
    const context = useContext(ProposalsContext)
    if (!context) {
        throw new Error(
            "useProposalsContext must be used within a ProposalsProvider"
        )
    }
    return context
}

export function ProposalsContextProvider({
    children,
    value,
}: {
    children: React.ReactNode
    value: ProposalsContextObject
}) {
    return (
        <ProposalsContext.Provider value={value}>
            {children}
        </ProposalsContext.Provider>
    )
}
