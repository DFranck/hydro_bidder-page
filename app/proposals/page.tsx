import { getTributeValuesFromPriceFeed } from "@/hooks/hooks"
import { fetchDashboardData } from "../dashboard/getData"
import ActiveProposals from "./component"
import { ProposalListTopModules } from "./TopModules"
import { WelcomePopup } from "./welcomePopup"
import { ProposalsContextProvider } from "@/app/proposals/context"

export default async function ActiveProposalsPage() {
    const dashboardData = await fetchDashboardData()

    const {
        currentProposalTranches,
        globalState,
        currentProposalTributes,
        currentRoundEnd,
    } = dashboardData

    const { totalTributeValue, atomPrice } =
        await getTributeValuesFromPriceFeed(currentProposalTributes)

    const proposalsContextObject = {
        ...dashboardData,
        totalTributeValue,
        atomPrice,
    }

    // console.log("#### totalValue", totalValue)
    // console.log("#### trancheDenoms", trancheDenoms)
    // console.log("#### trancheDenomAPIIds", fetchDenoms, missingDenoms)

    return (
        <ProposalsContextProvider value={proposalsContextObject}>
            <div className="pb-44 max-w-7xl mx-auto px-6">
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
        </ProposalsContextProvider>
    )
}
