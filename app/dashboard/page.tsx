import { Suspense } from "react"
import { fetchDashboardData } from "./dashboardFetch"
import Dashboard from "./dashboard"
import LockupsTable from "./lockupsTable"

export default async function Page() {
    const { currentProposalTranches, globalState } = await fetchDashboardData()
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Dashboard activeTab="lockups">
                <LockupsTable
                    currentProposalTranches={currentProposalTranches}
                    globalState={globalState}
                />
            </Dashboard>
        </Suspense>
    )
}
