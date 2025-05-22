"use server"

import { ReactNode } from "react"
import { DummyDataProvider } from "./DummyDataProvider"
import { getDummyData } from "./getDummyData"

export async function DummyDataProviderServer({
  children,
}: {
  children: ReactNode
}) {
  const dummyData = await getDummyData()
  return <DummyDataProvider dummyData={dummyData}>{children}</DummyDataProvider>
}
