import type { Tribute } from "@/app/ts_types/TributeBase.types"
import type { TokenBasedTribute } from "@/contract-apis/types"

export function toTokenBased(t: Tribute): TokenBasedTribute {
  return {
    // requis par TokenBasedTribute
    id: Number(t.tribute_id),                 // identifiant d’affichage
    bidId: Number(t.proposal_id),             // proposal ciblée
    denom: t.funds?.denom ?? "",              // libellé “humain” (on met le même)
    denomOriginal: t.funds?.denom ?? "",
    amount: Number(t.funds?.amount ?? "0"),   // on met la valeur en base units, l’UI sait la rendre
    valueUsd: 0,                              // pas de pricing ici → 0
    // facultatifs mais présents dans le type (via CamelCase)
    roundId: Number(t.round_id),
    trancheId: Number(t.tranche_id),
    depositor: t.depositor,
    refunded: Boolean(t.refunded),
    creationTime: t.creation_time,
    creationRound: Number(t.creation_round),
    // priceUsd n’est pas forcément requis ; si ton type le demande:
    // priceUsd: 0,
  } as TokenBasedTribute
}
