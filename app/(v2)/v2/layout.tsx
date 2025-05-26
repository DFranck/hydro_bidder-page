import { getDummyData } from "./dummy-data/getDummyData"
import { DummyDataProvider } from "./dummy-data/useDummyData"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const dummyData = await getDummyData()

  return <DummyDataProvider dummyData={dummyData}>{children}</DummyDataProvider>
}
