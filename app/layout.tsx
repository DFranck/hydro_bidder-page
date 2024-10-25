import { ScrollIndicator } from "@/components/ScrollIndicator"
import { inter } from "@/lib/font"
import type { Metadata } from "next"
import Script from "next/script"
import { ClientHandler } from "./clientLayout"
import "./globals.css"

export const metadata: Metadata = {
    title: "Hydro - The Interchain Liquidity Allocator",
    description:
        "Hydro is a liquidity-allocation platform built for the Cosmos Hub. Lock, vote & earn today!",
    metadataBase: new URL("https://hydro.cosmos.network"),
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className="scroll-pt-32">
            <head>
                <Script
                    crossOrigin="anonymous"
                    src="https://kit.fontawesome.com/401fb1e734.js"
                />
                {process.env.NODE_ENV === "production" && (
                    <>
                        <Script
                            async
                            src="https://www.googletagmanager.com/gtag/js?id=G-NZ1F6WL2PM"
                        ></Script>
                        <Script
                            id="google-analytics"
                            strategy="afterInteractive"
                        >
                            {`
                            window.dataLayer = window.dataLayer || []
                            function gtag(){dataLayer.push(arguments)}
                            gtag('js', new Date())
                            gtag('config', 'G-NZ1F6WL2PM')
                        `}
                        </Script>
                        <Script
                            type="text/javascript"
                            src="https://www.bugherd.com/sidebarv2.js?apikey=mdyh8j9rijiqijf1qow8tw"
                            async
                        ></Script>
                    </>
                )}
            </head>
            <body
                className={`${inter.className} relative overflow-x-hidden text-white`}
            >
                <div
                    className="
                        fixed
                        left-0
                        top-0
                        -z-10
                        h-screen
                        w-screen
                        bg-black
                        bg-[url('/images/AdobeStock_633966567.png')]
                        bg-cover
                        bg-no-repeat
                    "
                ></div>
                <ClientHandler>{children}</ClientHandler>
                <ScrollIndicator />
            </body>
        </html>
    )
}
