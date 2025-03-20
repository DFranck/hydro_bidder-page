"use server"

export async function getDefaultMetadata() {
  return {
    title: "The Interchain Liquidity Allocator",
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

export async function getMetadataByRoute() {
  const defaultMetadata = await getDefaultMetadata()
  const { title: defaultTitle } = defaultMetadata

  return {
    "/": {
      ...defaultMetadata,
      title: `Hydro - ${defaultTitle}`,
    },

    "/airdrops": {
      ...defaultMetadata,
      title: `Hydro Airdrops - ${defaultTitle}`,
    },

    "/bids": {
      ...defaultMetadata,
      title: `Hydro Bids - ${defaultTitle}`,
    },

    "/lock-atom": {
      ...defaultMetadata,
      title: `Lock Atom on Hydro - ${defaultTitle}`,
    },

    "/lockups": {
      ...defaultMetadata,
      title: `Hydro Lockups - ${defaultTitle}`,
    },

    "/metrics": {
      ...defaultMetadata,
      title: `Hydro Metrics - ${defaultTitle}`,
    },

    "/rewards": {
      ...defaultMetadata,
      title: `Hydro Rewards - ${defaultTitle}`,
    },
  }
}
