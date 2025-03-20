"use client"

import { getEnvironmentVariable } from "@/contract-apis/getEnvironmentVariable"
import dynamic from "next/dynamic"

export const BackendDataTweaker = dynamic(
  () =>
    getEnvironmentVariable("NEXT_PUBLIC_USE_FIXTURE_DATA") === "true"
      ? import("@/components/BackendDataTweaker").then(
          (mod) => mod.BackendDataTweaker
        )
      : Promise.resolve(() => null),
  { ssr: false }
)
