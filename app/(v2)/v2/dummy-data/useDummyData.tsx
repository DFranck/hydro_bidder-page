"use client"

import { DummyData } from "@/app/(v2)/v2/dummy-data/getDummyData"
import { createContext, use } from "react"

export const DummyDataContext = createContext<DummyData | null>(null)

export function useDummyData() {
  return use(DummyDataContext)
}
