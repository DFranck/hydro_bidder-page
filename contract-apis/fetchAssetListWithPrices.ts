import { getPriceFeedUrl } from "@/config"
import { cacheRevalidationInterval } from "./_globals"

export interface AssetListEntry {
  token: string
  symbol: string
  decimals: number
  coingeckoId?: string
  priceUsd?: number
}

export async function fetchAssetListWithPrices(): Promise<
  Record<string, AssetListEntry>
> {
  // Fetch the asset list
  const response = await fetch(
    "https://raw.githubusercontent.com/astroport-fi/astroport-token-lists/refs/heads/main/tokenLists/neutron.json",
    {
      next: { revalidate: cacheRevalidationInterval }, // Revalidate every 5 minutes
    }
  )
  const data: AssetListEntry[] = await response.json()

  // Extract Coingecko IDs from assets that have them
  const coingeckoIds = data
    .filter((asset) => asset.coingeckoId)
    .map((asset) => asset.coingeckoId as string)

  // Fetch prices using getPriceFeedUrl
  const pricesResponse = await fetch(
    getPriceFeedUrl([...coingeckoIds, "switcheo"])
  )
  const prices: Record<string, { usd: number }> = await pricesResponse.json()

  // Create an object with token as key and updated AssetListEntry as value
  const assetMap = data.reduce<Record<string, AssetListEntry>>((acc, asset) => {
    const updatedAsset =
      asset.coingeckoId && prices[asset.coingeckoId]
        ? { ...asset, priceUsd: prices[asset.coingeckoId].usd }
        : asset
    acc[asset.token] = updatedAsset
    return acc
  }, {})

  return assetMap
}
