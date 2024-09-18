import { Suspense } from "react"
import Dashboard from "../dashboard"
import TributesTable from "./tributesTable"
import { fetchDashboardData } from "../getData"
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
