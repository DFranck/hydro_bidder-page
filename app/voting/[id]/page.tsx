import { ContentContainer } from "@/components/ContentContainer"
import { ProposalListTopModules } from "../TopModules"
import { Details } from "./details"

export default function VotingProposalSinglePage({
    params,
}: {
    params: { id: string }
}) {
    return (
        <ContentContainer className="gap-6 py-12">
            <ProposalListTopModules />
            <Details params={params} />
        </ContentContainer>
    )
}
