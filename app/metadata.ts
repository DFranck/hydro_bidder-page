export const defaultMetadata = {
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

const { title: defaultTitle, description: defaultDescription } = defaultMetadata

export const metadataByRoute = {
  "/": defaultMetadata,

  "/airdrops": {
    ...defaultMetadata,
    title: `Airdrops - ${defaultTitle}`,
    description: `Airdrops - ${defaultDescription}`,
  },

  "/bids": {
    ...defaultMetadata,
    title: `Bids - ${defaultTitle}`,
    description: `Bids - ${defaultDescription}`,
  },

  "/lock-atom": {
    ...defaultMetadata,
    title: `Lock Atom - ${defaultTitle}`,
    description: `Lock Atom - ${defaultDescription}`,
  },

  "/lockups": {
    ...defaultMetadata,
    title: `Lockups - ${defaultTitle}`,
    description: `Lockups - ${defaultDescription}`,
  },

  "/metrics": {
    ...defaultMetadata,
    title: `Metrics - ${defaultTitle}`,
    description: `Metrics - ${defaultDescription}`,
  },

  "/rewards": {
    ...defaultMetadata,
    title: `Rewards - ${defaultTitle}`,
    description: `Rewards - ${defaultDescription}`,
  },
}
