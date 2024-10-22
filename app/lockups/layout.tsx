import { AppContextProvider } from "@/app/context"
import { fetchDashboardData } from "@/hooks/hooks"

export default async function LockupsLayout({
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
