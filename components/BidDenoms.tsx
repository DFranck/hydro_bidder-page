import { FullyAugmentedBid } from "@/contract-apis/fetchBackendDataWithWallet"
import { startCase, uniq } from "lodash"

export function BidDenoms({ bid }: { bid: FullyAugmentedBid }) {
  return uniq(
    bid.tributes.map((tribute) =>
      tribute.isTokenBased
        ? tribute.denom.toUpperCase()
        : startCase(tribute.denom)
    )
  ).join(", ")
}
