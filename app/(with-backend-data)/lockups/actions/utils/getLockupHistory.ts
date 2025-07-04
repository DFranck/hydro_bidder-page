import { RoundWithBid } from "@/app/ts_types/HydroBase.types"
import { AugmentedLockup } from "@/contract-apis/types"
import { MarketplaceLockup } from "../../marketplace/types"

export interface LockupHistoryItem {
  trancheId?: number
  vote: { prop_id: number }
  round_id: number
  round_end: RoundWithBid["round_end"]
}

export function getLockupHistory(
  lockup: AugmentedLockup | MarketplaceLockup,
): LockupHistoryItem[] {
  const entries: LockupHistoryItem[] = []

  for (const [trancheIdStr, meta] of Object.entries(
    lockup.metaDataByTrancheId ?? {},
  )) {
    const trancheId = Number(trancheIdStr)

    meta.historicVotedOnProposals.forEach((historic) => {
      entries.push({
        trancheId,
        vote: { prop_id: historic.proposal_id },
        round_id: historic.round_id,
        round_end: historic.round_end,
      })
    })
  }

  entries.sort((a, b) => {
    const ta = new Date(a.round_end).getTime()
    const tb = new Date(b.round_end).getTime()
    return tb - ta
  })

  return entries
}
