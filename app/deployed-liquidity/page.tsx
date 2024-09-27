import DeployedLiquidity from "./component"
import { ProposalListTopModules } from "../proposals/TopModules"
import { fetchDashboardData,  } from "@/hooks/hooks"

export default async function DeployedProposalPage() {
    const {
        globalState,
        lastProposalTranches,
        lastProposalTributes,
    } = await fetchDashboardData()

    return (
        <div className="pb-44 max-w-7xl mx-auto px-5 lg:px-0">
            <ProposalListTopModules />
            <DeployedLiquidity
                lastProposalTranches={lastProposalTranches}
                lastProposalTributes={lastProposalTributes}
                globalState={globalState}
            />
        </div>
    )
}
