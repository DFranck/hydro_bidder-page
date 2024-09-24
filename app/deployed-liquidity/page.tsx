import DeployedLiquidity from "./component"
import { fetchDashboardData } from "../dashboard/getData"
import { ProposalListTopModules } from "../proposals/TopModules"
import { getTributeValuesFromPriceFeed } from "@/hooks/hooks"

export default async function DeployedProposalPage() {
    const {
        globalState,
        lastProposalTranches,
        lastProposalTributes,
        currentProposalTributes,
        currentRoundEnd,
    } = await fetchDashboardData()

    const { totalTributeValue, atomPrice } =
        await getTributeValuesFromPriceFeed(currentProposalTributes)

    return (
        <div className="pb-44 max-w-7xl mx-auto px-5 lg:px-0">
            <ProposalListTopModules
                trancheValue={totalTributeValue}
                lockedAtom={globalState.totalLockedTokens}
                roundEnd={currentRoundEnd}
                atomPrice={atomPrice}
                roundNumber={globalState.currentRound}
            />
            <DeployedLiquidity
                lastProposalTranches={lastProposalTranches}
                lastProposalTributes={lastProposalTributes}
                globalState={globalState}
            />
        </div>
    )
}
