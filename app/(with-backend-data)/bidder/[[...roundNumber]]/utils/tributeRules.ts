import type { BidRevampMetrics, TokenBasedTribute } from "@/contract-apis/types"

export function hasNonZeroDeployment(bid: any) {
  const funds = bid?.liquidityDeployment?.deployedFunds ?? []
  return (
    Array.isArray(funds) && funds.some((f: any) => Number(f?.amount ?? 0) > 0)
  )
}

export function canRefund(
  bid: any,
  tribute: any,
  currentRoundId: number,
  me?: string
) {
  const isVotingPeriod =
    bid.roundId === currentRoundId || bid.status === "Voting Period"
  const nonZeroDeployment = hasNonZeroDeployment(bid)
  const isDepositor =
    !!me && tribute.depositor?.toLowerCase() === me.toLowerCase()

  if (!isDepositor)
    return {
      ok: false as const,
      reason: "Only the depositor can refund this tribute.",
    }
  if (tribute.refunded)
    return {
      ok: false as const,
      reason: "This tribute is already refunded (claimable).",
    }
  if (isVotingPeriod)
    return {
      ok: false as const,
      reason: "Refunds are unavailable during the current voting period.",
    }
  if (nonZeroDeployment)
    return {
      ok: false as const,
      reason: "Liquidity was deployed; refund is not allowed.",
    }

  return { ok: true as const }
}

export function canAddTribute(bid: any, currentRoundId: number) {
  const nonZeroDeployment = hasNonZeroDeployment(bid)
  if (nonZeroDeployment) {
    return {
      ok: false as const,
      reason:
        "Liquidity was already deployed for this proposal. A new tribute would not be refundable.",
      warnings: [] as string[],
    }
  }

  const warnings: string[] = []
  if (bid.roundId !== currentRoundId && bid.status !== "Voting Period") {
    warnings.push(
      "This proposal is not in the current voting round; your tribute won't affect voting."
    )
  }
  if (bid.status === "Ongoing") {
    warnings.push(
      "Voting ended; refund stays possible until liquidity is deployed."
    )
  }
  if (bid.status === "Rejected") {
    warnings.push(
      "The proposal was rejected; you can still add a tribute and refund later."
    )
  }
  if (bid.status === "Completed") {
    warnings.push("This proposal is completed; ensure funds won't be stuck.")
  }

  return { ok: true as const, warnings }
}

export type TributeUiStatus =
  | "voting-period"
  | "refundable"
  | "claimable"
  | "not-refundable"

export function computeTributeUiStatus(
  bid: BidRevampMetrics,
  tribute: TokenBasedTribute,
  currentRoundId: number
): TributeUiStatus {
  if (tribute.refunded) return "claimable"
  if (bid.roundId === currentRoundId || bid.status === "Voting Period")
    return "voting-period"
  if (hasNonZeroDeployment(bid)) return "not-refundable"
  return "refundable"
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
      return "Round has ended and no liquidity was deployed. Depositor can refund."
    case "claimable":
      return "This tribute has been refunded. Voters can now claim."
    case "not-refundable":
      return "Liquidity was deployed for this bid; refund is blocked by the contract."
  }
}
