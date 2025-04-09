import { TributeClaim } from "@/app/ts_types/TributeBase.types"
import { getCoinWithValueInUsdByRoundPrices } from "@/contract-apis/getCoinWithValueInUsd"
import { AugmentedClaim, RoundPrices } from "@/contract-apis/types"
import { keysFromSnakeToCamelCase } from "@/lib/keysFromSnakeToCamelCase"
import omit from "lodash/omit"

export function augmentClaimByRoundPrices({
  roundPrices,
  claim,
}: {
  roundPrices: RoundPrices
  claim: TributeClaim
}): AugmentedClaim {
  return {
    ...keysFromSnakeToCamelCase(omit(claim, "proposalId")),
    amount: getCoinWithValueInUsdByRoundPrices({
      coin: claim.amount,
      roundPrices,
    }),
    bidId: claim.proposal_id,
  }
}
