"use client"

import { getDummyData } from "@/app/(v2)/v2/dummy-data/getDummyData"
import { DummyDataContext } from "@/app/(v2)/v2/dummy-data/useDummyData"
import { ReactNode } from "react"

export function DummyDataProvider({
  children,
  dummyData,
}: {
  children: ReactNode
  dummyData: Awaited<ReturnType<typeof getDummyData>>
}) {
  return <DummyDataContext value={dummyData}>{children}</DummyDataContext>
}
