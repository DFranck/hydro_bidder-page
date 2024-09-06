import React from "react";
import { fetchDashboardData } from "@/app/dashboard/dashboardFetch";
import ProposalDetail from '../../proposalDetail';


const Page = async ({ params }: { params: { id: string } }) => {
    const {
        currentProposalTranches,
        globalState,
    } = await fetchDashboardData();

    const currentProposal = Array.from(currentProposalTranches.values())
        .flat()
        .find(proposal => proposal.proposal_id === Number(params.id));

    return currentProposal ? (
        <ProposalDetail
            currentProposal={currentProposal}
            globalState={globalState}
            currentProposalTranches={currentProposalTranches}
            deployed={false}
        />
    ) : (
        <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-red-500">Error: Proposal not found</h2>
            <p className="mt-2 text-gray-600">The requested proposal could not be found.</p>
        </div>
    )
};

export default Page;