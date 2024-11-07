import { ContentContainer } from "@/components/ContentContainer"
import { LockupsTable } from "@/components/LockupsTable"
import { StatCards } from "@/components/StatCards"

export default async function Page() {
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
        <StatCards.YourTotalATOMLocked />
        <StatCards.HistoricalAPR />
      </div>

      <LockupsTable />
    </ContentContainer>
  )
}
