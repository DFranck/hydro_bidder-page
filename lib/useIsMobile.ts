"use client"

import { useIsClient, useMediaQuery } from "usehooks-ts"

export function useIsMobile({ valueOnServer = true } = {}) {
  const isClient = useIsClient()
  const isSmallScreen = useMediaQuery("(max-width: 768px)")
  return isClient ? isSmallScreen : valueOnServer
}
