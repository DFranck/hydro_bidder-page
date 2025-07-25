import { AugmentedLockup } from "@/contract-apis/types"
import { allowedListAmounts } from "../marketplace/config/allowedListAmounts"
import { MarketplaceLockup } from "../marketplace/types"
import { getDisplayDenom } from "./getDisplayDenom"

const speciesByAmount: Record<number, string> = {
  25: "Piranha",
  50: "Barracuda",
  100: "Swordfish",
  250: "Shark",
  500: "Whale",
  1000: "Kraken",
}

type ImgSrcResult = {
  src: string
  fallback?: string
}

export function getLockupImage(
  lockup: AugmentedLockup | MarketplaceLockup,
): ImgSrcResult {
  const amount = Number(lockup.funds.amount)
  const denom = getDisplayDenom(lockup.funds.denom)
  const allowedAmount = allowedListAmounts.find((a) => a === amount)
  const species = allowedAmount ? speciesByAmount[allowedAmount] : undefined

  if (!allowedAmount) {
    return { src: "/images/Question_BLANK.png" }
  }

  const cleanDenom = denom || "Blank"

  const mainSrc = `/images/${cleanDenom}/${allowedAmount}_${species}_${cleanDenom}@4x.png`
  const fallbackSrc = `/images/Blank/${allowedAmount}_${species}_Blank@4x.png`

  return {
    src: mainSrc,
    fallback: cleanDenom === "Blank" ? undefined : fallbackSrc,
  }
}
