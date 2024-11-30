"use client"

// https://dev.to/tyuen/nextjs-app-router-navigation-indicator-and-the-delay-after-onclick-5aba
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

let clickTime = 0
let pathWhenClicked = ""

export function useIsLoadingNewRoute() {
  const curPath = usePathname()

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    clickTime = 0
    if (curPath !== pathWhenClicked) {
      setLoading(false)
    }
  }, [curPath])

  useEffect(() => {
    if (typeof navigator === "undefined") return

    const onMessage = ({
      data,
    }: {
      data: { fetchUrl: string; dest: string }
    }) => {
      if (Date.now() - clickTime > 1000) return

      const url = toURL(data.fetchUrl)
      if (url?.search.startsWith("?_rsc=") && data.dest === "") {
        clickTime = 0
        setLoading(true)
      }
    }

    const sw = navigator.serviceWorker
    sw?.addEventListener("message", onMessage)

    const onClick = (e: MouseEvent) => {
      clickTime = Date.now()
      pathWhenClicked = location.pathname
    }

    addEventListener("click", onClick, true)

    return () => {
      sw?.removeEventListener("message", onMessage)
      removeEventListener("click", onClick, true)
    }
  }, [])

  return loading
}

function toURL(url: string) {
  try {
    if (url) return new URL(url)
  } catch (e) {}
  return null
}
