import { AugmentedBid } from "@/contract-apis/fetchBackendDataAfterWallet"
import { startCase, uniq } from "lodash"

export function BidDenoms({ bid }: { bid: AugmentedBid }) {
  return uniq(
    bid.tributes.map((tribute) =>
      tribute.isTokenBased
        ? tribute.denom?.toUpperCase()
        : startCase(tribute.denom)
    )
  ).join(", ")
}
