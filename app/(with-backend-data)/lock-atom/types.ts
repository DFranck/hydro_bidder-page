export type Stepper =
  | { type: "lock"; validator: string; amount: string; duration: number }
  | {
      type: "revertFromHubLSM"
      validator: string
      amount: string
      denom: string
    }
  | {
      type: "revertFromNeutronLSM"
      validator: string
      amount: string
      denom: string
      baseDenom: string
    }
  | {
      type: "continueFromHubLSM"
      validator: string
      amount: string
      denom: string
    }
  | {
      type: "continueFromNeutronLSM"
      validator: string
      amount: string
      denom: string
      baseDenom: string
    }

export type IncompleteNotice = {
  type: "LSMSharesOnNeutron" | "LSMSharesOnHub"
  validator: string
  amount: string
  denom: string
  baseDenom?: string
}

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
