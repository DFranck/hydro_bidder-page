import { AugmentedBid } from "@/contract-apis/fetchBackendDataAfterWallet"
import startCase from "lodash/startCase"
import uniq from "lodash/uniq"

export function BidDenoms({ bid }: { bid: AugmentedBid }) {
  return uniq(
    bid.tributes.map((tribute) =>
      tribute.isTokenBased
        ? tribute.denom?.toUpperCase()
        : startCase(tribute.denom)
    )
  ).join(", ")
}
