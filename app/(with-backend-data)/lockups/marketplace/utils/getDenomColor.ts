import { denomsForNFTMarketplace } from "../config/denomsForNFTMarketplace"

export function getDenomColor(baseDenom: string): string | null {
  return (
    denomsForNFTMarketplace.find((d) => d.baseDenom === baseDenom)?.color ??
    null
  )
}
