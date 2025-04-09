import { TributeClaim } from "@/app/ts_types/TributeBase.types"
import { getCoinWithRoundPrices } from "@/contract-apis/getCoinWithRoundPrices"
import { AugmentedClaim, RoundPrices } from "@/contract-apis/types"
import { keysFromSnakeToCamelCase } from "@/lib/keysFromSnakeToCamelCase"
import omit from "lodash/omit"

export function augmentClaimWithRoundPrices({
  roundPrices,
  claim,
}: {
  roundPrices: RoundPrices
  claim: TributeClaim
}): AugmentedClaim {
  return {
    ...keysFromSnakeToCamelCase(omit(claim, "proposalId")),
    amount: getCoinWithRoundPrices({
      coin: claim.amount,
      roundPrices,
    }),
    bidId: claim.proposal_id,
  }
}
