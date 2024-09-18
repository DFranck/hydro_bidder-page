import DeployedLiquidity from "./component"
import { ATOM_PRICE_URL } from "../config"
import { fetchDashboardData } from "../dashboard/getData"
import { ProposalListTopModules } from "../voting-proposals/TopModules"

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

    const allTributesCoins = Array.from(currentProposalTributes.values())
        .flat()
        .reduce((acc, tribute) => {
            const { denom, amount } = tribute.funds
            if (!acc[denom]) {
                acc[denom] = BigInt(0)
            }
            acc[denom] += BigInt(amount)
            return acc
        }, {} as Record<string, bigint>)

    // gets symbol/pretty name for each denom
    const resolvedTributes = Object.entries(allTributesCoins).reduce(
        (acc, [denom, amount]) => {
            const asset = NEUTRON_ASSETS.assets.find(
                (asset) =>
                    asset.base.toLowerCase() === denom.toLowerCase() ||
                    (denom.toLowerCase().startsWith("ibc/") &&
                        asset.base.toLowerCase() === denom.toLowerCase())
            )
            const symbol = asset ? asset.symbol : denom
            acc[symbol] = amount
            return acc
        },
        {} as Record<string, bigint>
    )

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
