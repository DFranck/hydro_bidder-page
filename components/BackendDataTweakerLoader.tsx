"use client"

import dynamic from "next/dynamic"

const BackendDataTweaker = dynamic(
  () =>
    process.env.NODE_ENV === "development"
      ? import("@/components/BackendDataTweaker").then(
          (mod) => mod.BackendDataTweaker
        )
      : Promise.resolve(() => null),
  { ssr: false }
)

export { BackendDataTweaker }
