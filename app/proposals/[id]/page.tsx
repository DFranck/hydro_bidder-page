"use client"

import { useProposalsContext } from "@/app/proposals/context"
import ProposalDetail from "@/components/proposalDetail"
import { ProposalListTopModules } from "../TopModules"

export default function VotingProposalSinglePage({
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
        <div className="mx-auto max-w-7xl space-y-12 px-6 pb-44 lg:px-12">
            <ProposalListTopModules />
            {currentProposal ? (
                <ProposalDetail proposal={currentProposal} deployed={false} />
            ) : (
                <div className="py-8 text-center">
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
