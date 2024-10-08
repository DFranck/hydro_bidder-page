import { VotingContextProvider } from "@/app/voting/context"
import { fetchDashboardData } from "@/hooks/hooks"

export default async function ProposalsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const dashboardData = await fetchDashboardData()

    return (
        <VotingContextProvider value={dashboardData}>
            {children}
        </VotingContextProvider>
    )
}
