import { denomsForNFTMarketplace } from "../marketplace/config/denomsForNFTMarketplace"

export function getDenomExponent(denom: string): number {
  const found = denomsForNFTMarketplace.find((d) => d.baseDenom === denom)
  return found?.exponent ?? 0
}
