import { ATOM_PRICE_URL, getPriceFeedUrl } from "@/config"
import { fetchDashboardData } from "../dashboard/getData"
import ActiveProposals from "./component"
import { ProposalListTopModules } from "./TopModules"
import { WelcomePopup } from "./welcomePopup"
import { Button } from "@/components/ui/button"
import { FEED_COINS_BY_SYMBOL } from "@/config/feed"
import { Tribute } from "../ts_types/TributeBase.types"

type TributesValuePerDenom = {
    amount: number
    apiId: string
}

function tributesValuePerDenom(
    currentProposalTributes: Map<number, Tribute[]>
): Map<string, TributesValuePerDenom> {
    const trancheDenoms = new Map<
        string,
        {
            amount: number
            apiId: string
        }
    >()
    Array.from(currentProposalTributes.values())
        .flat()
        .forEach((t) => {
            const denom = t.funds.denom
            const amount = parseInt(t.funds.amount)
            if (trancheDenoms.has(denom)) {
                const current = trancheDenoms.get(denom)!
                current.amount += amount
                trancheDenoms.set(denom, current)
            } else {
                const apiId = FEED_COINS_BY_SYMBOL.get(denom)?.api_id
                trancheDenoms.set(denom, { amount, apiId: apiId ?? "" })
            }
        })

    return trancheDenoms
}

export default async function ActiveProposalsPage() {
    const {
        currentProposalTranches,
        globalState,
        currentProposalTributes,
        currentRoundEnd,
    } = await fetchDashboardData()

    let atomPrice = 0
    let totalValue = 0
    const trancheDenoms = tributesValuePerDenom(currentProposalTributes)
    const fetchDenoms: string[] = ["cosmos"] // always fetch atom
    const missingDenoms: string[] = []
    trancheDenoms.forEach((value, denom) => {
        if (value.apiId) {
            fetchDenoms.push(value.apiId)
        } else {
            missingDenoms.push(denom)
        }
    })

    try {
        // responds with: { cosmos: { usd: 4.13 } }
        const res = await fetch(getPriceFeedUrl(fetchDenoms)).then((res) =>
            res.json()
        )
        atomPrice = res["cosmos"]["usd"]
        totalValue = Array.from(trancheDenoms.values()).reduce(
            (acc, { amount, apiId }) => {
                const price = res[apiId]["usd"] / 1e6
                return acc + price * amount
            },
            0
        )
    } catch {
        console.log("failed to fetch atom price data")
    }
    // console.log("#### totalValue", totalValue)
    // console.log("#### trancheDenoms", trancheDenoms)
    // console.log("#### trancheDenomAPIIds", fetchDenoms, missingDenoms)

    return (
        <div className="pb-44 max-w-7xl mx-auto px-5 lg:px-0">
            <WelcomePopup />
            <ProposalListTopModules
                trancheValue={totalValue}
                lockedAtom={globalState.totalLockedTokens}
                roundEnd={currentRoundEnd}
                atomPrice={atomPrice}
                roundNumber={globalState.currentRound}
            />
            <ActiveProposals
                currentProposalTranches={currentProposalTranches}
                currentProposalTributes={currentProposalTributes}
                globalState={globalState}
            />
        </div>
    )
}
