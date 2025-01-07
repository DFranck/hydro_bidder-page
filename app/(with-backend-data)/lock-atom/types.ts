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

export type IncompleteNotice =
  | {
      type: "LSMSharesOnHub"
      validator: string
      amount: string
      denom: string
      baseDenom: never
    }
  | {
      type: "LSMSharesOnNeutron"
      validator: string
      amount: string
      denom: string
      baseDenom: string
    }
