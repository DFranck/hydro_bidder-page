"use server"

import { getPriceFeedUrl } from "@/config"
import { AssetListEntry, AssetListWithPrices } from "@/contract-apis/types"
import { fetchWithRetry } from "./fetchWithRetry"

const symbolToCoingeckoId: Record<string, string> = {
  BLD: "agoric",
  SWTH: "switcheo",
}

function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  return keys.reduce(
    (acc, key) => {
      if (key in obj) {
        acc[key] = obj[key]
      }
      return acc
    },
    {} as Pick<T, K>
  )
}

export async function fetchAssetListWithPrices(): Promise<AssetListWithPrices> {
  const response = await fetchWithRetry(
    "https://raw.githubusercontent.com/astroport-fi/astroport-token-lists/refs/heads/main/tokenLists/neutron.json",
    {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 86400 }, // 24 hours
    }
  )
  const assetList: AssetListEntry[] = await response.json()

  const patchedAssetList = assetList.map((asset) => {
    if (asset.symbol in symbolToCoingeckoId) {
      return { ...asset, coingeckoId: symbolToCoingeckoId[asset.symbol] }
    }
    return asset
  })

  const coingeckoIds = patchedAssetList
    .filter((asset) => "coingeckoId" in asset)
    .map((asset) => asset.coingeckoId!)

  const pricesResponse = await fetchWithRetry(getPriceFeedUrl(coingeckoIds), {
    headers: {
      Accept: "application/json",
    },
    next: { revalidate: 86400 }, // 24 hours
  })

  const pricesByCoingeckoId: Record<string, { usd: number }> =
    await pricesResponse.json()

  const assetMap = Object.fromEntries(
    patchedAssetList
      .filter((asset) => "coingeckoId" in asset)
      .map((asset) => {
        const assetWithPriceMaybe =
          asset.coingeckoId && pricesByCoingeckoId[asset.coingeckoId]
            ? { ...asset, priceUsd: pricesByCoingeckoId[asset.coingeckoId].usd }
            : asset
        return [
          asset.token,
          pick(assetWithPriceMaybe, [
            "symbol",
            "decimals",
            "coingeckoId",
            "priceUsd",
          ]),
        ]
      })
  )

  return assetMap as AssetListWithPrices
}
