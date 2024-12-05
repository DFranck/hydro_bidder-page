import { inter } from "@/lib/font"
import Script from "next/script"
import "./globals.css"
import "./injectServiceWorker.js"

export async function generateMetadata() {
  return {
    title: "Hydro - The Interchain Liquidity Allocator",
    description:
      "Hydro is a liquidity-allocation platform built for the Cosmos Hub. Lock, vote, and earn today!",
    metadataBase: new URL("https://hydro.cosmos.network"),
    openGraph: {
      url: "https://hydro.cosmos.network",
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
        {process.env.CONTEXT === "production" && (
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
      </body>
    </html>
  )
}
