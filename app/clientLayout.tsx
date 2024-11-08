"use client"

import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { WalletHandler } from "./wallet"

// allows us to wrap children into a client context while the normal layout stays in a server component
// this allows the normal layout to use fonts, meta fields (for icons, title texts etc.)
export function ClientHandler({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <>
      <WalletHandler>
        <QueryClientProvider client={queryClient}>
          <div
            className="
              grid
              w-screen
              grid-rows-[auto,min-content]
            "
          >
            <div>
              <Header />
              {children}
            </div>
            <Footer />
          </div>
        </QueryClientProvider>
      </WalletHandler>
    </>
  )
}
