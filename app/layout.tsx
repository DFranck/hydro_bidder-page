"use server"

import { defaultMetadata, metadataByRoute } from "@/app/metadata"
import { BackendDataTweaker } from "@/components/BackendDataTweaker"
import { inter } from "@/lib/font"
import sortBy from "lodash/sortBy"
import { headers } from "next/headers"
import Script from "next/script"
import "./globals.css"
import "./injectServiceWorker.js"

export async function generateMetadata() {
  const headersList = await headers()
  const requestedPathname = new URL(headersList.get("x-url") || "").pathname

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
        <Script
          crossOrigin="anonymous"
          src="https://kit.fontawesome.com/401fb1e734.js"
        />
        {process.env.NEXT_PUBLIC_SHOW_HIDDEN_FEATURES !== "true" && (
          <>
            <Script
              async
              src="https://www.googletagmanager.com/gtag/js?id=G-NZ1F6WL2PM"
            />
            <Script id="google-analytics" strategy="afterInteractive">
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
            />
          </>
        )}
      </head>
      <body className={`${inter.className} relative overflow-x-hidden`}>
        {children}
        <BackendDataTweaker />
      </body>
    </html>
  )
}
