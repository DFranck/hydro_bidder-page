import { Suspense } from "react"
import Dashboard from "../dashboard"
import TributesTable from "./tributesTable"
import { fetchDashboardData } from "@/hooks/hooks"

export default async function Page() {
    const {
        currentProposalTranches,
        globalState,
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
