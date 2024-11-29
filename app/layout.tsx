"use server"

import { inter } from "@/lib/font"
import type { Metadata } from "next"
import Script from "next/script"
import "./globals.css"

export async function generateMetadata(): Promise<Metadata> {
  if (!process.env.SITE_URL) {
    throw new Error("SITE_URL is not defined")
  }

  return {
    title: "Hydro - The Interchain Liquidity Allocator",
    description:
      "Hydro is a liquidity-allocation platform built for the Cosmos Hub. Lock, vote, and earn today!",
    metadataBase: new URL(process.env.SITE_URL),
    openGraph: {
      url: process.env.SITE_URL,
      siteName: "Hydro",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: "https://hydro.cosmos.network/images/opengraph-image.jpg",
          width: 1200,
          height: 630,
        },
      ],
    },
  }
}

export default async function RootLayout({
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
              type="text/javascript"
              src="https://www.bugherd.com/sidebarv2.js?apikey=mdyh8j9rijiqijf1qow8tw"
              async
            />
          </>
        )}
      </head>
      <body className={`${inter.className} relative overflow-x-hidden`}>
        {children}
      </body>
    </html>
  )
}
