import { Suspense } from "react"
import { fetchDashboardData } from "./dashboardFetch"
import LockupsTable from "./lockupsTable"
import { DashboardTopModules } from "./TopModules"

export default async function Page() {
    const { currentProposalTranches, globalState } = await fetchDashboardData()
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="max-w-7xl mx-auto">
                <DashboardTopModules />
                <div className="pt-10 pb-44">
                    <LockupsTable
                        currentProposalTranches={currentProposalTranches}
                        globalState={globalState}
                    />
                </div>
            </div>
        </Suspense>
    )
}
