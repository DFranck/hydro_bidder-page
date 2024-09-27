"use client"

import { fetchDashboardData } from "@/hooks/hooks"
import { createContext, useContext } from "react"

export type ProposalsContextObject = Awaited<
    ReturnType<typeof fetchDashboardData>
>

// Define the type for ProposalsContext
export const ProposalsContext: React.Context<ProposalsContextObject | null> = createContext<ProposalsContextObject | null>(null);

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
