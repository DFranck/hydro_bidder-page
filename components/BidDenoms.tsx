import { FullyAugmentedBid } from "@/contract-apis/fetchBackendDataWithWallet"
import { startCase } from "lodash"

export function BidDenoms({ bid }: { bid: FullyAugmentedBid }) {
  return bid.tributes
    .map((tribute) =>
      tribute.isTokenBased
        ? tribute.denom.toUpperCase()
        : startCase(tribute.denom)
    )
    .join(", ")
}
