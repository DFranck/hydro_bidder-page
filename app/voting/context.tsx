"use client"

import { fetchDashboardData } from "@/hooks/hooks"
import { createContext, useContext } from "react"

export type VotingContextObject = Awaited<ReturnType<typeof fetchDashboardData>>

// Define the type for VotingContext
export const VotingContext: React.Context<VotingContextObject | null> =
    createContext<VotingContextObject | null>(null)

export function useVotingContext() {
    const context = useContext(VotingContext)
    if (!context) {
        throw new Error("useVotingContext must be used within a VotingProvider")
    }
    return context
}

export function VotingContextProvider({
    children,
    value,
}: {
    children: React.ReactNode
    value: VotingContextObject
}) {
    return (
        <VotingContext.Provider value={value}>
            {children}
        </VotingContext.Provider>
    )
}
