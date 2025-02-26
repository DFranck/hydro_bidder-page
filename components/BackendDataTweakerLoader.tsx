"use client"

import dynamic from "next/dynamic"

const BackendDataTweaker = dynamic(
  () =>
    process.env.NEXT_PUBLIC_USE_FIXTURE_DATA === "true"
      ? import("@/components/BackendDataTweaker").then(
          (mod) => mod.BackendDataTweaker
        )
      : Promise.resolve(() => null),
  { ssr: false }
)

export { BackendDataTweaker }
