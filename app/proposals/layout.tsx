import { fetchDashboardData } from "@/app/dashboard/getData"
import { ProposalsContextProvider } from "@/app/proposals/context"
import { getTributeValuesFromPriceFeed } from "@/hooks/hooks"

export default async function ProposalsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const dashboardData = await fetchDashboardData()

    const { currentProposalTributes } = dashboardData

    const { totalTributeValue, atomPrice } =
        await getTributeValuesFromPriceFeed(currentProposalTributes)

    const proposalsContextObject = {
        ...dashboardData,
        totalTributeValue,
        atomPrice,
    }

    return (
        <ProposalsContextProvider value={proposalsContextObject}>
            {children}
        </ProposalsContextProvider>
    )
}
