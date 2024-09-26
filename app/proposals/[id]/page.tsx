"use client"

import { useProposalsContext } from "@/app/proposals/context"
import ProposalDetail from "@/components/proposalDetail"
import { ProposalListTopModules } from "../TopModules"

export default async function VotingProposalSinglePage({
    params,
}: {
    params: { id: string }
}) {
    const { currentProposalTranches, currentProposalTributes, globalState } =
        useProposalsContext()

    const currentProposal = Array.from(currentProposalTranches.values())
        .flat()
        .find((proposal) => proposal.proposal_id === Number(params.id))

    return (
        <div className="pb-44 max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
            <ProposalListTopModules />
            {currentProposal ? (
                <ProposalDetail proposal={currentProposal} deployed={false} />
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
