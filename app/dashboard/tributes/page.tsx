import { Suspense } from "react";
import { fetchDashboardData } from "../dashboardFetch";
import Dashboard from "../dashboard"

export default async function Page() {
    const {
        lastProposalTranches,
        currentProposalTranches,
        lastVotingPower,
        currentVotingPower,
        globalState,
        currentProposalTributes,
        lastProposalTributes
    } = await fetchDashboardData();
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Dashboard
                lastProposalTranches={lastProposalTranches}
                currentProposalTranches={currentProposalTranches}
                lastVotingPower={lastVotingPower}
                currentVotingPower={currentVotingPower}
                globalState={globalState}
                currentProposalTributes={currentProposalTributes}
                lastProposalTributes={lastProposalTributes}
            />
        </Suspense>
    )
}
