// Types: Claimable staking rewards
// Added by Poly on 2025-04-08
export type ClaimableRewardItem = {
  recordId: string
  atomAmount: number
  usdAmount: number
}

export type ClaimableRewardsSummary = {
  totalAtom: number
  totalUsd: number
  rewards: ClaimableRewardItem[]
}
