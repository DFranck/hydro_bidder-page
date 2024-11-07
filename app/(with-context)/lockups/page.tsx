import { ContentContainer } from "@/components/ContentContainer"
import { LockupsTable } from "@/components/LockupsTable"
import { TopModulesForLockups } from "@/components/TopModulesForLockups"

export default async function Page() {
  return (
    <ContentContainer className="gap-12 py-12">
      <TopModulesForLockups />
      <LockupsTable />
    </ContentContainer>
  )
}
