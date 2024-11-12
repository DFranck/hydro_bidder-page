"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function MetricsPage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/metrics/post-hydro")
  }, [])

  return null
}
