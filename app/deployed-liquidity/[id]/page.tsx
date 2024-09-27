import React from "react"
import ProposalDetail from "@/components/proposalDetail"
import { fetchDashboardData } from "@/hooks/hooks"

const Page = async ({ params }: { params: { id: string } }) => {
    const { lastProposalTranches, lastProposalTributes } = await fetchDashboardData()

    if (!lastProposalTranches || !lastProposalTributes) {
        return (
            <div className="text-center py-8">
                <h2 className="text-2xl font-bold text-red-500">
                    Error: Proposal not found
                </h2>
                <p className="mt-2 text-gray-600">
                    The requested proposal could not be found.
                </p>
            </div>
        )
    }

    const lastProposal = Array.from(lastProposalTranches.values())
        .flat()
        .find((proposal) => proposal.proposal_id === Number(params.id))

    return lastProposal ? (
        <ProposalDetail
            proposal={lastProposal}
            deployed={true}
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
    )
}

export default Page
