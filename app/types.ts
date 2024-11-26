import { Addr, Constants, Timestamp, Tranche } from "./ts_types/HydroBase.types"

// AllUserLockups
// Constants
// CurrentRound
// ExpiredUserLockups
// Proposal
// RoundEnd
// RoundProposals
// RoundTotalVotingPower
// TopNProposals
// TotalLockedTokens
// Tranches
// UserVote
// UserVotingPower
// WhitelistAdmins
// Whitelist
export type GlobalState = {
  constants: Partial<Constants>
  currentRound: number
  totalLockedTokens: number
  tranches: Tranche[]
  whitelistAdmins: Addr[]
  whitelist: Addr[]
}

export type RoundState = {
  roundEnd: Timestamp
  totalVotingPower: BigInt
}
