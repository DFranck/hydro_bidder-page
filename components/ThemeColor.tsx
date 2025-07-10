"use client"

import { useEffect } from "react"

export function ThemeColor({
  themeColor,
  metaTagId = "meta-theme-color",
}: {
  themeColor: string
  metaTagId?: string
}) {
  useEffect(() => {
    const metaTagElement = document.getElementById(metaTagId)
    const resolvedThemeColor = themeColor.startsWith("var(")
      ? getComputedStyle(document.documentElement).getPropertyValue(
          themeColor.replace("var(", "").replace(")", "")
        )
      : themeColor

    if (metaTagElement) {
      metaTagElement.setAttribute("content", resolvedThemeColor)
    } else {
      const metaTagElement = document.createElement("meta")
      metaTagElement.name = "theme-color"
      metaTagElement.id = metaTagId
      metaTagElement.setAttribute("content", resolvedThemeColor)
      document.head.appendChild(metaTagElement)
    }

    return () => {
      const metaTagElement = document.getElementById(metaTagId)
      if (metaTagElement) {
        document.head.removeChild(metaTagElement)
      }
    }
  }, [themeColor, metaTagId])

  return null
}
