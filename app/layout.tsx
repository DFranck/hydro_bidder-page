"use server"

import { getDefaultMetadata, getMetadataByRoute } from "@/app/metadata"
import sortBy from "lodash/sortBy"
import { Inter } from "next/font/google"
import { headers } from "next/headers"
import Script from "next/script"
import { twJoin } from "tailwind-merge"
import "./globals.css"

const InterFont = Inter({ subsets: ["latin"], preload: true })

export async function generateMetadata() {
  const headersList = await headers()
  const requestedPathname = new URL(headersList.get("x-url") || "").pathname

  const metadataByRoute = await getMetadataByRoute()
  const defaultMetadata = await getDefaultMetadata()

  const sortedMetadataByRoute = sortBy(
    Object.entries(metadataByRoute),
    ([route]) => route.length
  )

  const routeMetadataEntry =
    sortedMetadataByRoute.find(([pathname]) =>
      pathname.startsWith(requestedPathname)
    )?.[1] ?? defaultMetadata

  return routeMetadataEntry
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-pt-32">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1"
        />
        <Script
          crossOrigin="anonymous"
          src="https://kit.fontawesome.com/401fb1e734.js"
          strategy="lazyOnload"
        />
        {process.env.NEXT_PUBLIC_SHOW_HIDDEN_FEATURES !== "true" && (
          <>
            <Script
              async
              src="https://www.googletagmanager.com/gtag/js?id=G-JXM6TCWTSW"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || []
                function gtag(){dataLayer.push(arguments)}
                gtag('js', new Date())
                gtag('config', 'G-JXM6TCWTSW')
              `}
            </Script>
            <Script
              type="text/javascript"
              src="https://www.bugherd.com/sidebarv2.js?apikey=mdyh8j9rijiqijf1qow8tw"
              async
            />
          </>
        )}
      </head>
      <body
        className={twJoin(
          InterFont.className,
          "relative overflow-x-hidden",
          "bg-palette-text text-white"
        )}
      >
        {children}
      </body>
    </html>
  )
}
