import { AppContextProvider } from "@/app/(with-context)/context"
import { fetchDashboardData } from "@/hooks/hooks"

export default async function VotingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const dashboardData = await fetchDashboardData()

    return (
        <AppContextProvider value={dashboardData}>
            {children}
        </AppContextProvider>
    )
}
