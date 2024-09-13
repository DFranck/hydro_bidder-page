import { Suspense } from "react"
import { fetchDashboardData } from "../dashboardFetch"
import Dashboard from "../dashboard"
import TributesTable from "./tributesTable"

export default async function Page() {
    const {
        lastProposalTranches,
        currentProposalTranches,
        lastVotingPower,
        currentVotingPower,
        globalState,
        currentProposalTributes,
        lastProposalTributes,
    } = await fetchDashboardData()
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Dashboard activeTab="tributes">
                <TributesTable
                    currentProposalTranches={currentProposalTranches}
                    globalState={globalState}
                />
            </Dashboard>
        </Suspense>
    )
}
