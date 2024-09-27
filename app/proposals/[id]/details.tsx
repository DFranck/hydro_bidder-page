import { useProposalsContext } from "@/app/proposals/context"
import ProposalDetail from "@/components/proposalDetail"


export function Details({ params }: { params: { id: string } }) {
    const { currentProposalTranches } =useProposalsContext()

    const currentProposal = Array.from(currentProposalTranches.values())
    .flat()
    .find((proposal) => proposal.proposal_id === Number(params.id))

    return currentProposal ?(
        <ProposalDetail proposal={currentProposal} deployed={false} />
    ) :(
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
