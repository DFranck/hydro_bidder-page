import { ContentContainer } from "@/components/ContentContainer"
import { Details } from "./details"

export default function VotingProposalSinglePage({
    params,
}: {
    params: { id: string }
}) {
    return (
        <ContentContainer className="py-6">
            <Details params={params} />
        </ContentContainer>
    )
}
