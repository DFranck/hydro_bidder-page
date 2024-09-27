import { ProposalsContextProvider } from "@/app/proposals/context"
import { fetchDashboardData } from "@/hooks/hooks"

export default async function ProposalsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const dashboardData = await fetchDashboardData()

    return (
        <ProposalsContextProvider value={dashboardData}>
            {children}
        </ProposalsContextProvider>
    )
}
