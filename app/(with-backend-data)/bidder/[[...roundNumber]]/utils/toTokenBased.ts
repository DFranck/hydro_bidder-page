import type { Tribute } from "@/app/ts_types/TributeBase.types"
import type { TokenBasedTribute } from "@/contract-apis/types"

export function toTokenBased(t: Tribute): TokenBasedTribute {
  return {
    id: Number(t.tribute_id),               
    bidId: Number(t.proposal_id),             
    denom: t.funds?.denom ?? "",              
    denomOriginal: t.funds?.denom ?? "",
    amount: Number(t.funds?.amount ?? "0"),  
    valueUsd: 0,                              
   
    roundId: Number(t.round_id),
    trancheId: Number(t.tranche_id),
    depositor: t.depositor,
    refunded: Boolean(t.refunded),
    creationTime: t.creation_time,
    creationRound: Number(t.creation_round),
  } as TokenBasedTribute
}
