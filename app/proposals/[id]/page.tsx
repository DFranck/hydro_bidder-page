import React from "react"
import ProposalDetail from "../../../components/proposalDetail"
import { fetchDashboardData } from "@/app/dashboard/getData"
import { ATOM_PRICE_URL } from "@/config"
import { ProposalListTopModules } from "../TopModules"

export default async function VotingProposalSinglePage({
    params,
}: {
    params: { id: string }
}) {
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

    const currentProposal = Array.from(currentProposalTranches.values())
        .flat()
        .find((proposal) => proposal.proposal_id === Number(params.id))

    return (
        <div className="pb-44 max-w-7xl mx-auto px-5 lg:px-0">
            <ProposalListTopModules
                lockedAtom={globalState.totalLockedTokens}
                roundEnd={currentRoundEnd}
                atomPrice={atomPrice}
                roundNumber={globalState.currentRound}
            />
            {currentProposal ? (
                <ProposalDetail
                    proposal={currentProposal}
                    globalState={globalState}
                    proposalTranches={currentProposalTranches}
                    deployed={false}
                    tributes={
                        currentProposalTributes.get(
                            currentProposal.proposal_id
                        )!
                    }
                />
            ) : (
                <div className="text-center py-8">
                    <h2 className="text-2xl font-bold text-red-500">
                        Error: Proposal not found
                    </h2>
                    <p className="mt-2 text-gray-600">
                        The requested proposal could not be found.
                    </p>
                </div>
            )}
        </div>
    )
}
