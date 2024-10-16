import { fetchDashboardData } from "@/hooks/hooks"
import { ProposalListTopModules } from "../voting/TopModules"
import DeployedLiquidity from "./component"
import { ContentContainer } from "@/components/ContentContainer"

export default async function DeployedProposalPage() {
    const { globalState, lastProposalTranches, lastProposalTributes } =
        await fetchDashboardData()

    return (
        <ContentContainer>
            <ProposalListTopModules />
            <DeployedLiquidity
                lastProposalTranches={lastProposalTranches}
                lastProposalTributes={lastProposalTributes}
                globalState={globalState}
            />
        </ContentContainer>
    )
}
