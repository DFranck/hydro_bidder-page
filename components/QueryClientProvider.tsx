"use client"

import {
  QueryClientProvider as BaseQueryClientProvider,
  QueryClient,
} from "@tanstack/react-query"
import { useState } from "react"

// allows us to wrap children into a client context while the normal layout stays in a server component
// this allows the normal layout to use fonts, meta fields (for icons, title texts etc.)
export function QueryClientProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <BaseQueryClientProvider client={queryClient}>
      {children}
    </BaseQueryClientProvider>
  )
}
