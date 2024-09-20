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
            <body className={`${inter.className}`}>
                <div className="bg-gradient-to-b from-black via-[#010006] to-[#001C47] p-5 h-screen w-screen fixed top-0 left-0 -z-10"></div>
                <div className="text-white p-5 lg:p-0">
                    <ClientHandler>{children}</ClientHandler>
                </div>
            </body>
        </html>
    )
}
