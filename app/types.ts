import { Tranche, Constants, Proposal, LockEntry, Timestamp, Uint128, Vote, Addr } from './ts_types/HydroBase.types';

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
    constants: Constants;
    currentRound: number;
    totalLockedTokens: number;
    tranches: Tranche[];
    whitelistAdmins: Addr[];
    whitelist: Addr[];
};
export type RoundState = {
    roundEnd: Timestamp;
    // TODO: This is a large number so we should use a large number library
    totalVotingPower: number;
};