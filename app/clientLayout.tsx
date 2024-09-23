"use client"

import { Header } from "../components/Header"
import { WalletHandler } from "./wallet"
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

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
                    <Header />
                    {children}
                    <Toaster />
                </QueryClientProvider>
            </WalletHandler>
        </>
    )
}
