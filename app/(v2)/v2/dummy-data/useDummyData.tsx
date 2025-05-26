"use client"

import { createContext, useContext } from "react"
import { DummyData } from "./getDummyData"

const DummyDataContext = createContext<DummyData | null>(null)

export function DummyDataProvider({
  children,
  dummyData,
}: {
  children: React.ReactNode
  dummyData: DummyData
}) {
  return (
    <DummyDataContext.Provider value={dummyData}>
      {children}
    </DummyDataContext.Provider>
  )
}

export function useDummyData() {
  const context = useContext(DummyDataContext)
  if (!context) {
    throw new Error("useDummyData must be used within DummyDataProvider")
  }
  return context
}
