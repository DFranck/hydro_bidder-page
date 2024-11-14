import { ContentContainer } from "@/components/ContentContainer"
import { LockupsTable } from "@/components/LockupsTable"
import { StatCards } from "@/components/StatCards"

export default async function Page() {
  return (
    <>
      <StatCards>
        <StatCards.TotalATOMLocked />
        <StatCards.YourTotalATOMLocked />
        <StatCards.HistoricalAPR />
      </StatCards>

      <ContentContainer className="gap-12 py-12">
        <LockupsTable />
      </ContentContainer>
    </>
  )
}
