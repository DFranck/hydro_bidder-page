import { VotingContextProvider } from "@/app/voting/context"
import { fetchDashboardData } from "@/hooks/hooks"

export default async function VotingLayout({
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
