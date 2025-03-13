import { AssetListEntry } from "@/contract-apis/fetchAssetListWithPrices"
import { AugmentedClaim, SanitizedClaim } from "@/contract-apis/fetchClaims"
import { getCoinWithValueInUsd } from "@/contract-apis/getCoinWithValueInUsd"

export function augmentClaims({
  assetListWithPrices,
  claims,
}: {
  assetListWithPrices: Record<string, AssetListEntry>
  claims: SanitizedClaim[]
}): AugmentedClaim[] {
  return claims.map((claim) => ({
    ...claim,
    amount: getCoinWithValueInUsd({
      coin: claim.amount,
      assetListWithPrices,
    }),
  }))
}
