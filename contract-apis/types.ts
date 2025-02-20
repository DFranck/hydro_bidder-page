import {
  Coin,
  LiquidityDeployment,
  Proposal,
  Tranche,
  VoteWithPower,
} from "@/app/ts_types/HydroBase.types"
import { Tribute, TributeClaim } from "@/app/ts_types/TributeBase.types"
import { CamelCaseKeys } from "@/lib/keysFromSnakeToCamelCase"

export type ArbitraryAmountWithDescription = [
  amount: number,
  description: string,
]

export interface AssetListWithPrices {
  [key: string]: {
    priceUsd: number
    symbol: string
    decimals: number
  }
}

export interface AugmentedBid extends AugmentedBidFromContract {
  lockupsOutliveBidDeployment: boolean
  usersEstimatedRewards: number
  usersEstimatedRewardRelativeToCurrentPick: number
}

export interface AugmentedBidFromContract
  extends Omit<
    CamelCaseKeys<BidFromContract>,
    "deploymentDuration" | "percentage" | "proposalId"
  > {
  id: number
  deploymentDurationInEpochs: number
  deploymentDurationInNanos: number
  liquidityDeployment: SanitizedLiquidityDeployment | null
  percentage: number
  tributes: (SanitizedTokenBasedTribute | SanitizedPointBasedTribute)[]
  tributeApr: number
  tributeAprMax: number
  tributeAprMin: number
}

export interface AugmentedClaim extends Omit<SanitizedClaim, "amount"> {
  amount: AugmentedCoin
}

export interface AugmentedCoin extends Coin {
  humanReadableDenom: string
  printableAmount: number
  priceUsd: number
  valueUsd: number
}

export interface AugmentedLiquidityDeployment
  extends Omit<SanitizedLiquidityDeployment, "fundsBeforeDeployment"> {
  fundsBeforeDeployment: AugmentedCoin[]
}

export interface BackendDataAfterWallet extends BackendDataBeforeWallet {
  address: string
  bidsById: Record<number, AugmentedBid>
  claimsHistorical: AugmentedClaim[]
  claimsOutstanding: AugmentedClaim[]
  isLoading: boolean
  isWalletConnected: boolean
  lockedAtomIsAtCapacityWallet: boolean
  lockedAtomPercentageWallet: number
  lockedAtomTotalWallet: number
  lockups: SanitizedLockup[]
  votes: SanitizedVote[]
  votesByRoundId: Record<number, SanitizedVote[]>
  votingPowerAvailable: number
  votingPowerSpent: number
  votingPowerTotal: number
}

export interface BackendDataBeforeWallet {
  assetListWithPrices: AssetListWithPrices
  atomPrice: number
  bidDescriptionsByBidId: Record<string, BidDescriptionFromGithub>
  bidsById: Record<number, AugmentedBidFromContract>
  currentRoundEndDate: Date
  currentRoundId: number
  currentRoundIsPilot: boolean
  tranches: Tranche[]
  lockedAtomIsAtCapacityGlobal: boolean
  lockedAtomEpochInNanos: number
  lockedAtomMaxGlobal: number
  lockedAtomMaxWallet: number
  lockedAtomPercentageGlobal: number
  lockedAtomRemainingCapacityGlobal: number
  lockedAtomTotalGlobal: number
  metricsForPostHydroBids: SanitizedBidFromNumia[]
  metricsForPreHydroBids: SanitizedBidFromNumia[]
  metricsGlobal: SanitizedMetricsFromNumia
  minTributeFactor: number
}

export interface BidDescriptionFromGithub {
  aboutProject?: string
  appendix?: string
  committeeComments?: string
  description: string
  pointProgramUrl?: string
  points?: ArbitraryAmountWithDescription
  projectLogoUrl?: string
  projectName: string
  projectUrl: string
  requestAmount: ArbitraryAmountWithDescription[]
  title: string
  minMaxTargetPolApr?: [min: number, max: number]
}

export interface BidFromContract extends Proposal {}

export interface BidFromNumia {
  // Needed to link data
  id: string
  round: string
  tranche: number

  // not used; from github
  comments: string
  project_about: string
  project_logo_url: string
  project_url: string
  project: string
  title: string
  description: string

  // The more of this we get from the contract, the better
  apr: number
  current_allocation_amount: number
  duration_days: number // only used for pre-hydro bids
  initial_allocation_amount: number
  offchain_tribute_info: string
  offchain_tribute: string
  onchain_tribute_assets: string
  onchain_tribute_usdc: number
  requested_allocation_amount: number
  requested_allocation_denom: string
  status: string
  voters: number
  voting_power: number
}

export interface MetricsFromNumia {
  // used
  all_time_pol_apr: number
  all_time_pol_deployed: number
  all_time_pol_revenue: number
  all_time_tribute_apr: number
  all_time_unique_wallets: number
  all_time_users_avg_rounds_locked: number
  all_time_users_avg_tokens_locked: number
  current_pol_available: number
  current_tribute_apr: number

  // not used
  all_time_pol_yield: number
  all_time_total_active_rounds: number
  all_time_total_atom_locked: number
  all_time_tribute_yield: number
  current_pol_deployed: number
  current_pol_deployment_cap: number
  current_pol_total: number
  current_total_atom_locked: number
  current_tribute_yield: number
  current_unique_wallets: number
  current_users_avg_rounds_locked: number
  current_users_avg_tokens_locked: number
}

export type OnchainTributeFromNumia = {
  amount: number
  denom?: string
  asset?: string
}

export type SanitizedBidFromNumia = CamelCaseKeys<
  Omit<
    BidFromNumia,
    | "offchain_tribute"
    | "onchain_tribute_assets"
    | "tranche"
    | "project"
    | "round"
  >
> & {
  isOngoing: boolean
  isPending: boolean
  isRejected: boolean
  isVoting: boolean
  projectName: string
  tranche: number
  roundId: number | "pre-hydro"
  offchainTribute: SanitizedOffchainTributeFromNumia[]
  onchainTributeAssets: SanitizedOnchainTributeFromNumia[]
}

export interface SanitizedClaim
  extends Omit<CamelCaseKeys<TributeClaim>, "proposalId"> {
  bidId: number
}

export interface SanitizedLiquidityDeployment
  extends Omit<CamelCaseKeys<LiquidityDeployment>, "proposalId"> {
  bidId: number
}

export interface SanitizedLockup {
  id: number
  currentVotingPower: number
  dateEnd: Date
  dateStart: Date
  daysLeft: number
  funds: {
    amount: number
    denom: string
  }
  isExpired: boolean
  isEligibleThisRoundAtAll: boolean
  isEligibleToChangeVote: boolean
  isEligibleButHasNotVoted: boolean
  isTiedToDeployment: boolean
  multiplier: number
  metaDataByTrancheId: Record<
    number,
    {
      nextRoundEligibleToVote: number | null
      votedOnBidId: number | null
    }
  >
  nextRoundEligibleToVote: number | null
  numRoundsLeftOnDeployment: number
  votedOnBidId: number | null
}

export interface SanitizedMetricsFromNumia
  extends CamelCaseKeys<MetricsFromNumia> {}

export type SanitizedOffchainTributeFromNumia = {
  amount: number
  type: string
}

export type SanitizedOnchainTributeFromNumia = {
  amount: number
  denom: string
}

export type SanitizedPointBasedTribute = {
  amount: number
  bidId: number
  denom: string
  isTokenBased: false
  roundId: number
  trancheId: number
  valueUsd: number
}

export type SanitizedTokenBasedTribute = Omit<
  CamelCaseKeys<Tribute>,
  "funds" | "proposalId" | "tributeId"
> & {
  id: number
  amount: number
  bidId: number
  denom: string
  valueUsd: number
  isTokenBased: true
}

export interface SanitizedVote
  extends Omit<CamelCaseKeys<VoteWithPower>, "propId"> {
  bidId: number
}
