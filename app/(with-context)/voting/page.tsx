import { ContentContainer } from "@/components/ContentContainer"
import { ProposalsTable } from "@/components/ProposalsTable/ProposalsTable"
import { StatCards } from "@/components/StatCards"

export default async function ActiveProposalsPage() {
  return (
    <>
      <div
        className="
          relative
          z-10
          bg-gradient-to-t
          from-palette-blue/80
          to-palette-blue/20
          py-6
          backdrop-blur-sm
        "
      >
        <ContentContainer
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
        </ContentContainer>
      </div>

      <ContentContainer className="gap-12 py-12">
        <ProposalsTable />
      </ContentContainer>
    </>
  )
}
