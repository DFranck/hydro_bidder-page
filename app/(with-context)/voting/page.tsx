import { ContentContainer } from "@/components/ContentContainer"
import { ProposalsTable } from "@/components/ProposalsTable/ProposalsTable"
import { StatCards } from "@/components/StatCards"

export default async function ActiveProposalsPage() {
  return (
    <>
      <StatCards>
        <StatCards.TotalATOMLocked />
        <StatCards.AverageAPR />
        <StatCards.DaysRemaining />
      </StatCards>
      <ContentContainer className="gap-12 py-12">
        <ProposalsTable />
      </ContentContainer>
    </>
  )
}
