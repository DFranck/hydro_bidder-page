import React from "react"
import ProposalDetail from "../../ui/proposalDetail"
import { fetchDashboardData } from "@/app/dashboard/getData"
import { ATOM_PRICE_URL } from "@/app/config"
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

    const currentProposal = Array.from(currentProposalTranches.values())
        .flat()
        .find((proposal) => proposal.proposal_id === Number(params.id))

    return (
        <div className="pb-44 max-w-7xl mx-auto px-5 lg:px-0">
            <ProposalListTopModules
                lockedAtom={globalState.totalLockedTokens}
                roundEnd={currentRoundEnd}
                atomPrice={atomPrice}
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
