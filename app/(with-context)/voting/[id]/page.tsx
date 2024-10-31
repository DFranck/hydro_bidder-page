import { ContentContainer } from "@/components/ContentContainer"
import { TopModulesForVoting } from "../../../../components/TopModulesForVoting"
import { Details } from "./details"

export default function VotingProposalSinglePage({
    params,
}: {
    params: { id: string }
}) {
    return (
        <ContentContainer className="gap-6 py-12">
            <TopModulesForVoting />
            <Details params={params} />
        </ContentContainer>
    )
}
