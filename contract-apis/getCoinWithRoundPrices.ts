import { Coin } from "@/app/ts_types/HydroBase.types"
import { AugmentedCoin, RoundPrices } from "@/contract-apis/types"
import { truncateString } from "@/lib/formatString"
import { TOKEN_DENOMS } from "@/lib/tokenDenoms"

export function getCoinWithRoundPrices({
  coin,
  roundPrices,
  validator,
  raw,
}: {
  coin: Coin
  roundPrices: RoundPrices
  validator?: string
  raw?: string
}): AugmentedCoin {
  const asset = roundPrices?.[coin.denom]
  const assetPriceUsd = asset?.token_price ?? 0
  const decimals = asset?.token_exponent ?? 6
  const humanReadableDenom =
    asset?.token_symbol ?? getDenomDisplayName(coin.denom)
  const printableAmount = Number(coin.amount) / 10 ** decimals

  return {
    ...coin,
    humanReadableDenom: validator ? "ATOM" : humanReadableDenom,
    validator: validator,
    raw: raw,
    printableAmount,
    priceUsd: assetPriceUsd,
    valueUsd: printableAmount * assetPriceUsd,
  } as AugmentedCoin
}

function getDenomDisplayName(denom: string) {
  const matched = Object.values(TOKEN_DENOMS).find(
    (token) => token.denom === denom
  )
  return (
    matched?.displayDenom ??
    truncateString({ string: denom, afterDotsStringLength: 5 })
  )
}
