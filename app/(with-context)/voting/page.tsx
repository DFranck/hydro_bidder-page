import { ContentContainer } from "@/components/ContentContainer"
import { ProposalsTable } from "@/components/ProposalsTable/ProposalsTable"
import { StatCards } from "@/components/StatCards"

export default async function ActiveProposalsPage() {
  return (
    <ContentContainer className="gap-12 py-12">
      <div
        className="
          grid
          grid-cols-1
          gap-6
          md:grid-cols-3
        "
      >
        <StatCards.TotalATOMLocked />
        <StatCards.AverageAPR />
        <StatCards.DaysRemaining />
      </div>

      <ProposalsTable />
    </ContentContainer>
  )
}
