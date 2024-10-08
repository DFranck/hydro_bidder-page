import { fetchDashboardData } from "@/hooks/hooks"
import { ProposalListTopModules } from "../voting/TopModules"
import DeployedLiquidity from "./component"

export default async function DeployedProposalPage() {
    const { globalState, lastProposalTranches, lastProposalTributes } =
        await fetchDashboardData()

    return (
        <div className="mx-auto max-w-7xl px-5 pb-44 lg:px-0">
            <ProposalListTopModules />
            <DeployedLiquidity
                lastProposalTranches={lastProposalTranches}
                lastProposalTributes={lastProposalTributes}
                globalState={globalState}
            />
        </div>
    )
}
