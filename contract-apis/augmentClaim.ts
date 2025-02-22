import { TributeClaim } from "@/app/ts_types/TributeBase.types"
import { getCoinWithValueInUsd } from "@/contract-apis/getCoinWithValueInUsd"
import { AssetListWithPrices, AugmentedClaim } from "@/contract-apis/types"
import { keysFromSnakeToCamelCase } from "@/lib/keysFromSnakeToCamelCase"
import omit from "lodash/omit"

export function augmentClaim({
  assetListWithPrices,
  claim,
}: {
  assetListWithPrices: AssetListWithPrices
  claim: TributeClaim
}): AugmentedClaim {
  return {
    ...keysFromSnakeToCamelCase(omit(claim, "proposalId")),
    amount: getCoinWithValueInUsd({
      coin: claim.amount,
      assetListWithPrices,
    }),
    bidId: claim.proposal_id,
  }
}
