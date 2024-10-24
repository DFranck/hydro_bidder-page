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
    bidDescriptions: Record<number, BidDescription> // bid ID
}

// amount, description
export type RequestAmount = [number, string]

export type BidDescription = {
    title: string
    description: string
    projectLogoUrl?: string
    projectName: string
    projectUrl: string
    committeeComments?: string
    requestAmount: RequestAmount[]
    points?: RequestAmount
    pointProgramUrl?: string
    appendix?: string
    // not available for all proposals (soft deprecated but still used)
    projectType?: string
}

export type RoundState = {
    roundEnd: Timestamp
    totalVotingPower: BigInt
}
