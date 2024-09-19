import DeployedLiquidity from "./component"
import { ATOM_PRICE_URL } from "@/config"
import { fetchDashboardData } from "../dashboard/getData"
import { ProposalListTopModules } from "../proposals/TopModules"

export default async function DeployedProposalPage() {
    const {
        globalState,
        lastProposalTranches,
        lastProposalTributes,
        currentProposalTributes,
        currentRoundEnd,
    } = await fetchDashboardData()

    let atomPrice = 0
    try {
        // responds with: { cosmos: { usd: 4.13 } }
        const res = await fetch(ATOM_PRICE_URL).then((res) => res.json())
        atomPrice = res["cosmos"]["usd"]
    } catch {
        console.log("failed to fetch atom price data")
    }

    return (
        <div className="pb-44 max-w-7xl mx-auto px-5 lg:px-0">
            <ProposalListTopModules
                lockedAtom={globalState.totalLockedTokens}
                roundEnd={currentRoundEnd}
                atomPrice={atomPrice}
            />
            <DeployedLiquidity
                lastProposalTranches={lastProposalTranches}
                lastProposalTributes={lastProposalTributes}
                globalState={globalState}
            />
        </div>
    )
}
