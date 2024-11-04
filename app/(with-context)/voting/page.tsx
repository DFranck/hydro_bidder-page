import { ContentContainer } from "@/components/ContentContainer"
import { ProposalsTable } from "../../../components/ProposalsTable/ProposalsTable"
import { TopModulesForVoting } from "../../../components/TopModulesForVoting"

export default async function ActiveProposalsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return (
    <ContentContainer className="gap-12 py-12">
      <TopModulesForVoting />
      <ProposalsTable searchParams={searchParams} />
    </ContentContainer>
  )
}
