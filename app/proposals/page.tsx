import { fetchDashboardData } from "../dashboard/getData"
import ActiveProposals from "./component"
import { ProposalListTopModules } from "./TopModules"
import { WelcomePopup } from "./welcomePopup"
import { getTributeValuesFromPriceFeed } from "@/hooks/hooks"

export default async function ActiveProposalsPage() {
    const {
        currentProposalTranches,
        globalState,
        currentProposalTributes,
        currentRoundEnd,
    } = await fetchDashboardData()

    const { totalTributeValue, atomPrice } =
        await getTributeValuesFromPriceFeed(currentProposalTributes)

    // console.log("#### totalValue", totalValue)
    // console.log("#### trancheDenoms", trancheDenoms)
    // console.log("#### trancheDenomAPIIds", fetchDenoms, missingDenoms)

    return (
        <div className="pb-44 max-w-7xl mx-auto px-5 lg:px-0">
            <WelcomePopup />
            <ProposalListTopModules
                trancheValue={totalTributeValue}
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
