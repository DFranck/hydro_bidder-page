"use server"

import { getPriceFeedUrl } from "@/config"
import { AssetListWithPrices } from "@/contract-apis/types"
import pick from "lodash/pick"

export interface AssetListEntry {
  token: string
  symbol: string
  decimals: number
  coingeckoId?: string
  priceUsd?: number
}

const symbolToCoingeckoId: Record<string, string> = {
  BLD: "agoric",
  SWTH: "switcheo",
}

export async function fetchAssetListWithPrices(): Promise<AssetListWithPrices> {
  const response = await fetch(
    "https://raw.githubusercontent.com/astroport-fi/astroport-token-lists/refs/heads/main/tokenLists/neutron.json",
    {
      next: {
        revalidate: 86400, // 24 hours in seconds
      },
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

  const pricesResponse = await fetch(getPriceFeedUrl(coingeckoIds), {
    next: {
      revalidate: 86400, // 24 hours in seconds
    },
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
