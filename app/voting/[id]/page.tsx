import { ContentContainer } from "@/components/ContentContainer"
import { ProposalListTopModules } from "../TopModules"
import { Details } from "./details"

export default function VotingProposalSinglePage({
    params,
}: {
    params: { id: string }
}) {
    return (
        <ContentContainer>
            <ProposalListTopModules />
            <Details params={params} />
        </ContentContainer>
    )
}
