import { fetchDashboardData } from "../dashboard/getData"
import ActiveProposals from "./component"
import { ProposalListTopModules } from "./TopModules"

const ATOM_PRICE_URL =
    "https://api.coingecko.com/api/v3/simple/price?ids=cosmos&vs_currencies=usd"

export default async function ActiveProposalsPage() {
    const {
        lastProposalTranches,
        currentProposalTranches,
        lastVotingPower,
        currentVotingPower,
        globalState,
        currentProposalTributes,
        lastProposalTributes,
        currentRoundEnd,
    } = await fetchDashboardData()

    let atomPrice = 0
    try {
        // { cosmos: { usd: 4.13 } }
        const res = await fetch(ATOM_PRICE_URL).then((res) => res.json())
        atomPrice = res["cosmos"]["usd"]
    } catch {
        console.log("failed to fetch atom price data")
    }

    return (
        <div className="px-[90px] pb-[90px] max-w-[1440px] mx-auto">
            <ProposalListTopModules
                lockedAtom={globalState.totalLockedTokens}
                roundEnd={currentRoundEnd}
                atomPrice={atomPrice}
            />
            <ActiveProposals
                currentProposalTranches={currentProposalTranches}
                currentProposalTributes={currentProposalTributes}
                globalState={globalState}
                roundEnd={currentRoundEnd}
            />
        </div>
    )
}
