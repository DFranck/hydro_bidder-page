
import type { Tribute } from "@/app/ts_types/TributeBase.types"
import { getCoinWithRoundPrices } from "@/contract-apis/getCoinWithRoundPrices"
import type { RoundPrices, TokenBasedTribute } from "@/contract-apis/types"
import { keysFromSnakeToCamelCase } from "@/lib/keysFromSnakeToCamelCase"
import { omit } from "lodash"

export function mapTributeToTokenBased(
  t: Tribute,
  roundPrices: RoundPrices
): TokenBasedTribute {
  const priced = getCoinWithRoundPrices({ coin: t.funds, roundPrices })
  return {
    // raw (camelCase)
    ...keysFromSnakeToCamelCase(omit(t, "proposal_id")),
    // UI fields aligned with augmentRoundDeploymentMetrics
    id: t.tribute_id,
    bidId: Number(t.proposal_id),
    amount: priced.printableAmount,
    denom: priced.humanReadableDenom,
    denomOriginal: t.funds.denom,
    priceUsd: priced.priceUsd,
    valueUsd: priced.valueUsd,
  } as TokenBasedTribute
}
