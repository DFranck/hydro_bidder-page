import { ContentContainer } from "@/components/ContentContainer"
import ActiveProposals from "./component"
import { ProposalListTopModules } from "./TopModules"

export default async function ActiveProposalsPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    return (
        <ContentContainer className="gap-12 py-12">
            <ProposalListTopModules />
            <ActiveProposals searchParams={searchParams} />
        </ContentContainer>
    )
}
