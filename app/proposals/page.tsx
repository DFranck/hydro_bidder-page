import { ATOM_PRICE_URL } from "@/config"
import { fetchDashboardData } from "../dashboard/getData"
import ActiveProposals from "./component"
import { ProposalListTopModules } from "./TopModules"

export default async function ActiveProposalsPage() {
    const {
        currentProposalTranches,
        globalState,
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
            <ActiveProposals
                currentProposalTranches={currentProposalTranches}
                currentProposalTributes={currentProposalTributes}
                globalState={globalState}
            />
        </div>
    )
}
