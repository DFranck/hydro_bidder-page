import type { BidRevampMetrics, TokenBasedTribute } from "@/contract-apis/types"

export function hasNonZeroDeployment(bid: any) {
  const funds = bid?.liquidityDeployment?.deployedFunds ?? []
  return Array.isArray(funds) && funds.some((f: any) => Number(f?.amount ?? 0) > 0)
}

export function canRefund(
  bid: BidRevampMetrics | any,
  tribute: TokenBasedTribute | any,
  currentRoundId: number,
  me?: string
) {
  const isDepositor = !!me && tribute.depositor?.toLowerCase() === me.toLowerCase()
  if (!isDepositor) {
    return { ok: false as const, reason: "Only the depositor can refund this tribute." }
  }
  if (tribute.refunded) {
    return { ok: false as const, reason: "This tribute is already refunded (claimable)." }
  }

  const inVotingPeriod = bid.roundId === currentRoundId || bid.status === "Voting Period"

  // Client rules: only Rejected is refundable
  if (bid.status === "Rejected") {
    return { ok: true as const }
  }
  if (inVotingPeriod) {
    return { ok: false as const, reason: "Refunds are unavailable during the voting period." }
  }
  if (bid.status === "Ongoing" || bid.status === "Completed") {
    return { ok: false as const, reason: "Refunds are not available for this bid." }
  }

  // Fallback (if any other status appears)
  return { ok: false as const, reason: "Refund is not available for this bid status." }
}

export function canAddTribute(bid: BidRevampMetrics | any, currentRoundId: number) {
  const warnings: string[] = []
  const inVotingPeriod = bid.roundId === currentRoundId || bid.status === "Voting Period"
  const hasDeployment = hasNonZeroDeployment(bid)

  // Rejected → should NOT be added
  if (bid.status === "Rejected") {
    return {
      ok: false as const,
      reason: "The proposal was rejected; you should not add a tribute.",
      warnings,
    }
  }

  // Allow adds in all other listed statuses, but warn as per rules
   if (bid.status === "Ongoing") {
    warnings.push("This is after the voting period, so your tribute will not affect voter behaviour.")
    warnings.push("Tributes are not refundable in 'Ongoing' status.")
  } else if (bid.status === "Completed") {
    warnings.push("This proposal is completed; tributes are not refundable.")
  }

  // If liquidity is already deployed, reinforce the non-refundability (but do NOT block add)
  if (hasDeployment) {
    warnings.push("Liquidity has been deployed; tributes are not refundable.")
  }

  return { ok: true as const, warnings }
}

export type TributeUiStatus = "voting-period" | "refundable" | "claimable" | "not-refundable"

export function computeTributeUiStatus(
  bid: BidRevampMetrics,
  tribute: TokenBasedTribute,
  currentRoundId: number
): TributeUiStatus {
  if (tribute.refunded) return "claimable"

  const inVotingPeriod = bid.roundId === currentRoundId || bid.status === "Voting Period"
  if (inVotingPeriod) return "voting-period"

  // Client rule: only Rejected is refundable
  if (bid.status === "Rejected") return "refundable"

  // Ongoing / Completed → not refundable
  return "not-refundable"
}

export const uiStatusLabel: Record<TributeUiStatus, string> = {
  "voting-period": "Voting period",
  refundable: "Refundable",
  claimable: "Claimable",
  "not-refundable": "Not refundable",
}

export function uiStatusTooltip(s: TributeUiStatus): string | undefined {
  switch (s) {
    case "voting-period":
      return "The bid is still active in the current round. Refunds are not available."
    case "refundable":
      return "The bid was rejected. The depositor can refund this tribute."
    case "claimable":
      return "This tribute has been refunded. Voters can now claim."
    case "not-refundable":
      return "Refund is not available for this bid (e.g., Ongoing or Completed)."
  }
}
