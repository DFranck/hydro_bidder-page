import { ProposalListTopModules } from "../TopModules"
import { Details } from "./details"

export default function VotingProposalSinglePage({
    params,
}: {
    params: { id: string }
}) {
    return (
        <div className="mx-auto max-w-7xl space-y-12 px-6 pb-44 lg:px-12">
            <ProposalListTopModules />
            <Details params={params} />
        </div>
    )
}
