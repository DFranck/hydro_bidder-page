
import { ProposalListTopModules } from "../TopModules"
import { Details } from "./details"

export default async function VotingProposalSinglePage({
    params,
}: {
    params: { id: string }
}) {
    return (
        <div className="pb-44 max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
            <ProposalListTopModules />
            <Details params={params} />
        </div>
    )
}
