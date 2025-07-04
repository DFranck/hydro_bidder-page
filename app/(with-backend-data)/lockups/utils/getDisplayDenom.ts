import { denomsForNFTMarketplace } from "../marketplace/config/denomsForNFTMarketplace"

export function getDisplayDenom(denom: string): string {
  const found = denomsForNFTMarketplace.find((d) => d.baseDenom === denom)
  return found?.displayDenom ?? denom
}
