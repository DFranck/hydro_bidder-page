import { EventAction } from "@/app/ts_types/MarketplaceBase.types"
import { LockupUnifiedHistoryItem } from "../../marketplace/types"
import { LockupHistoryItem } from "./getLockupHistory"

// Dans mergeLockupHistories.ts
export type ExtendedEvent = {
  action: EventAction
  metadata: {
    buyer?: string
    seller?: string
    price: {
      amount: string
      denom: string
    }
  }
  timestamp_nanos: number
}

export function mergeLockupHistories(
  votingHistory: LockupHistoryItem[],
  events: ExtendedEvent[],
): LockupUnifiedHistoryItem[] {
  const votingItems: LockupUnifiedHistoryItem[] = votingHistory.map((item) => ({
    type: "vote",
    date_nanos: item.round_end,
    round_id: item.round_id,
    proposal_id: item.vote.prop_id,
    trancheId: item.trancheId,
  }))

  const eventItems: LockupUnifiedHistoryItem[] = events.map((event) => {
    return {
      type: "event",
      date_nanos: event.timestamp_nanos,
      action: event.action,
      price: event.metadata.price,
    }
  })

  return [...votingItems, ...eventItems].sort(
    (a, b) => Number(b.date_nanos) - Number(a.date_nanos),
  )
}
