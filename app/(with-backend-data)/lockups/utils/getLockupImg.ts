import { AugmentedLockup } from "@/contract-apis/types"
import { allowedListAmounts } from "../marketplace/config/allowedListAmounts"
import { MarketplaceLockup } from "../marketplace/types"
import { getDisplayDenom } from "./getDisplayDenom"

const speciesByAmount: Record<number, string> = {
  [allowedListAmounts[0]]: "25_Piranha",
  [allowedListAmounts[1]]: "50_Barracuda",
  [allowedListAmounts[2]]: "100_Swordfish",
  [allowedListAmounts[3]]: "250_Shark",
  [allowedListAmounts[4]]: "500_Whale",
  [allowedListAmounts[5]]: "1000_Kraken",
}

type ImgSrcResult = {
  src: string
  fallback?: string
}

export function getLockupImage(
  lockup: AugmentedLockup | MarketplaceLockup
): ImgSrcResult {
  const amount = Number(lockup.funds.amount)
  const denom = getDisplayDenom(lockup.funds.denom)
  const allowedAmount = allowedListAmounts.find((a) => a === amount)
  const speciesWithAmount = allowedAmount
    ? speciesByAmount[allowedAmount]
    : undefined

  if (!allowedAmount) {
    return { src: "/images/Question_BLANK.png" }
  }

  const cleanDenom = denom || "Blank"

  const mainSrc = `/images/${cleanDenom}/${speciesWithAmount}_${cleanDenom}@4x.png`
  const fallbackSrc = `/images/Blank/${speciesWithAmount}_Blank@4x.png`

  return {
    src: mainSrc,
    fallback: cleanDenom === "Blank" ? fallbackSrc : undefined,
  }
}
