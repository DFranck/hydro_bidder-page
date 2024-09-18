import "./globals.css"
import { GoogleTagManager } from "@next/third-parties/google"

import Script from "next/script"
import { inter } from "@/lib/font"
import { ClientHandler } from "./clientLayout"

import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Hydro - Cosmos Hub Liquidity Platform",
    description:
        "Hydro is a Cosmos Hub liquidity platform that allows you to lock your ATOM and participate in the growth of the Cosmos ecosystem.",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            {/* <GoogleTagManager gtmId="G-NZ1F6WL2PM" />
      <Script
        type="text/javascript"
        src="https://www.bugherd.com/sidebarv2.js?apikey=mdyh8j9rijiqijf1qow8tw"
        async
      /> */}
            <body className={`${inter.className} text-white bg-black p-5`}>
                <ClientHandler>{children}</ClientHandler>
            </body>
        </html>
    )
}
