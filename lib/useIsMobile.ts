"use client"

import { useIsClient, useMediaQuery } from "usehooks-ts"

export function useIsMobile() {
  const isClient = useIsClient()
  return useMediaQuery("(max-width: 768px)") && isClient
}
