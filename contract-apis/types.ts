import { MarketplaceLockup } from "@/app/(with-backend-data)/lockups/marketplace/types"
import { CollectionConfig, Listing } from "@/app/ts_types/MarketplaceBase.types"
import { BaseRowObject } from "@/components/StyledTable/types"
import { ReactNode } from "react"
import {
  AllNftInfoResponse,
  Coin,
  Constants,
  LiquidityDeployment,
  LockEntryV2 as LockEntry,
  LockEntryWithPower,
  LockupWithPerTrancheInfo,
  PerTrancheLockupInfo,
  Proposal,
  RoundWithBid,
  Tranche,
  VoteWithPower,
} from "../app/ts_types/HydroBase.types"
import { Tribute, TributeClaim } from "../app/ts_types/TributeBase.types"
import { CamelCaseKeys } from "../lib/keysFromSnakeToCamelCase"

export type ArbitraryAmountWithDescription = [
  amount: number,
  description: string,
]

export interface AugmentedBackendDataAfterWallet
  extends AugmentedBackendDataBeforeWallet {
  address: string
  bidsInfo: Record<number, AugmentedBidAfterWallet>
  claimsHistorical: AugmentedClaim[]
  claimsOutstanding: AugmentedClaim[]
  isLoading: boolean
  isWalletConnected: boolean
  lockedTokenIsAtCapacityWallet: boolean
  lockedTokenPercentageWallet: number
  lockedAtomTotalWalletStat: number
  lockedStAtomTotalWalletStat: number
  lockedDAtomTotalWalletStat: number
  lockedTokenTotalWalletStat: number
  lockedTokenTotalWallet: number
  lockedTokenMaxWallet: number
  lockups: AugmentedLockup[]
  marketplaceLockups: MarketplaceLockup[]
  collections: CollectionConfig[]
  votes: SanitizedVote[]
  votesByRoundId: Record<number, SanitizedVote[]>
  votingPowerAvailableByTrancheId: Record<number, number>
  votingPowerSpentByTrancheId: Record<number, number>
  votingPowerTotal: number
  hasGatekeeper: boolean
}

export interface AugmentedBackendDataBeforeWallet {
  currentRoundPrices: RoundPrices
  atomPrice: number
  dAtomPrice: number
  stAtomPrice: number
  stOsmoPrice: number
  bidsInfo: Record<number, BidRevampMetrics>
  currentRoundEndDate: Date
  currentRoundId: number
  currentRoundIsPilot: boolean
  tranches: Tranche[]
  hydroLockups: AugmentedLockup[]
  hydroListings: Listing[]
  lockedTokenEpochInNanos: number
  metricsForPreHydroBids: PreHydroBid[]
  metricsGlobal: SanitizedMetricsFromNumia
  minTributeFactor: number
}

export type AugmentedClaim = Omit<SanitizedClaim, "amount"> & {
  amount: AugmentedCoin
}

export interface AugmentedCoin extends Coin {
  humanReadableDenom: string
  validator?: string
  printableAmount: number
  priceUsd: number
  valueUsd: number
}

export interface AugmentedLiquidityDeployment
  extends Omit<
    CamelCaseKeys<LiquidityDeployment>,
    "proposalId" | "deployedFunds" | "fundsBeforeDeployment"
  > {
  bidId: number
  deployedFunds: AugmentedCoin[] | null
  fundsBeforeDeployment: AugmentedCoin[] | null
}

export interface AugmentedLockup {
  id: number
  currentVotingPower: number
  dateEnd: Date
  dateStart: Date
  daysLeft: number
  funds: {
    amount: number
    denom: string
    denomInfo?: AugmentedCoin
  }
  isEligibleToVote: boolean
  isExpired: boolean
  multiplier: number
  outstanding: Coin[]
  metaDataByTrancheId: Record<
    number,
    {
      isEligibleToVote: boolean
      isEligibleToChangeVote: boolean
      isEligibleButHasNotVoted: boolean
      isTiedToDeployment: boolean
      nextRoundEligibleToVote: number | null
      numRoundsLeftOnDeployment: number | null
      votedOnBidId: number | null
      historicVotedOnProposals: RoundWithBid[]
    }
  >
}

export type BackendDataBeforeWallet = {
  externalData: RawExternalData
  hydroMetaData: RawHydroMetaData
  hydroRoundData: RawHydroRoundData[]
  hydroLockups: RawHydroLockups
  hydroListings: RawHydroListings
}

export type BackendDataBeforeWalletSlimmed = {
  externalData: RawExternalDataSlimmed
  hydroMetaData: RawHydroMetaData
  hydroRoundData: RawHydroRoundDataSlimmed[]
  hydroLockups: RawHydroLockups
  hydroListings: RawHydroListings
}

export interface BackendDataTweak {
  disabled?: boolean
  id: string
  label: string
  json: WithOverwrites<
    BackendDataBeforeWallet & {
      walletData: Partial<RawWalletData>
      patchData: Partial<AugmentedBackendDataAfterWallet>
    }
  >
}

export interface BidMetaData {
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
  atomic_bid_pair: number
}

export type BidMetaDataById = Record<string, BidMetaData>

export type BidMetaDataByIdSlimmed = Record<string, BidMetaDataSlimmed>

export type BidMetaDataSlimmed = Omit<
  BidMetaData,
  "aboutProject" | "committeeComments" | "description"
>

export interface BidRevampMetrics {
  apr_pol_target: any
  apr_pol: null
  apr_tribute: number | null
  duration: number
  id: number
  pointProgramUrl: any
  points: [amount: number, denom: string] | []
  projectName: string
  projectLogoUrl: string
  projectTitle: string
  isWhitelisted: boolean
  power: number
  request_amount: any
  roundId: number
  status: string
  title: string
  trancheId: number
  totalTokenBasedTributeValue: number
  tokenBasedTributes: TokenBasedTribute[]
  liquidityDeployment: AugmentedLiquidityDeployment | null
  vote_perc: number
  atomic_bid_pair: number
}

export interface AugmentedBidAfterWallet extends BidRevampMetrics {
  usersEstimatedRewards: number
  usersEstimatedRewardRelativeToCurrentPick: number
}

export interface GlobalLockupCapacityInfo {
  lockedTokenIsAtCapacityGlobal: boolean
  lockedTokenMaxGlobal: number
  lockedTokenPercentageGlobal: number
  lockedTokenRemainingCapacityGlobal: number
  lockedTokenTotalGlobal: number
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

export interface PriceDetails {
  token_symbol: string
  token_exponent: number
  token_price: number
}

export type ProposalSlimmed = Omit<Proposal, "description">

export type RawExternalData = {
  bidMetaDataById: BidMetaDataById
  preHydroBids: PreHydroBid[]
  numiaMetrics: MetricsFromNumia
}

export type RawExternalDataSlimmed = Omit<
  RawExternalData,
  "bidMetaDataById" | "preHydroBids"
> & {
  bidMetaDataById: BidMetaDataByIdSlimmed
  preHydroBids: PreHydroBid[]
}

export type RawHydroMetaData = {
  constants: Constants
  liquidity_deployments: LiquidityDeployment[]
  round_end: string
  round_id: number
  tranches: Tranche[]
}
export type RawHydroLockups = AllNftInfoResponse[]

export type RawHydroListings = Listing[]

export type RawHydroRoundData = {
  round_id: number
  round_bids: Proposal[]
  round_lockups: LockupWithPerTrancheInfo[][]
  round_tributes: Tribute[]
  round_prices: RoundPrices
}

export type RawHydroRoundDataSlimmed = Omit<RawHydroRoundData, "round_bids"> & {
  round_bids: ProposalSlimmed[]
}

export interface PreHydroBid {
  // Needed to link data
  id: string
  round: string
  tranche: number

  // not used; from github
  comments: string
  description: string
  project_about: string
  project_logo_url: string
  project_url: string
  project: string
  title: string

  // The more of this we get from the contract, the better
  apr: number
  current_allocation_amount: number
  duration_days: number | null // only used for pre-hydro bids
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
  yield: number
}

export interface AugmentedLockupWithPerTrancheInfo {
  lock_with_power: LockEntryWithPower & {
    lock_entry: LockEntry & {
      funds: AugmentedCoin
    }
  }
  per_tranche_info: PerTrancheLockupInfo[]
}

export interface RawWalletData {
  voting_power: number
  lockups_with_per_tranche_infos: AugmentedLockupWithPerTrancheInfo[]
  historical_tribute_claims: TributeClaim[]
  outstanding_tribute_claims: TributeClaim[]
  votes: VoteWithPower[]
  currently_locked: number | string
  maxUserCanLock: string
  hasGatekeeper: boolean
  listings: Listing[]
  collections: CollectionConfig[]
}

export interface RoundPrices {
  [key: string]: PriceDetails
}

export interface SanitizedMetricsFromNumia
  extends CamelCaseKeys<MetricsFromNumia> {}

export type TokenBasedTribute = Omit<
  CamelCaseKeys<Tribute>,
  "funds" | "proposalId" | "tributeId"
> & {
  id: number
  amount: number
  bidId: number
  denom: string
  denomOriginal: string
  valueUsd: number
}

export interface SanitizedVote
  extends Omit<CamelCaseKeys<VoteWithPower>, "propId"> {
  bidId: number
}

export interface SanitizedClaim
  extends Omit<CamelCaseKeys<TributeClaim>, "proposalId"> {
  bidId: number
}

export interface TrackingItem {
  bid_id: number
  initial_atom_allocation: number
  holdings: HoldingItem[]
}

export interface TrackingRow extends BaseRowObject {
  _bid: BidRevampMetrics
  _tracking: TrackingItem
  roundId: ReactNode
  logoAndTitle: ReactNode
  venueTvl: ReactNode
  committeeHolding: ReactNode
  actions: ReactNode
  additional?: ReactNode
}

export interface HoldingItem {
  info_missing: boolean
  protocol: string
  venue_total: {
    balances: BalanceItem[]
    total_usdc: number
    total_atom: number
  }
  address_holdings: {
    balances: BalanceItem[]
    total_usdc: number
    total_atom: number
  }
  address_rewards: {
    balances: BalanceItem[]
    total_usdc: number
    total_atom: number
  }
}

export interface BalanceItem {
  denom: string
  amount: number
  usd_value: number
  display_name: string
}

export interface ExperimentalItem {
  experimental_id: number
  name: string
  description: string
  logo: string
  start_timestamp: number
  end_timestamp: number
  initial_address_holdings: {
    balances: BalanceItem[]
    total_usdc: number
    total_atom: number
  }
  current_address_holdings: {
    balances: BalanceItem[]
    total_usdc: number
    total_atom: number
  }
}

export interface ExperimentalRow extends BaseRowObject {
  _experimental: ExperimentalItem
  logoAndName: ReactNode
  startDate: ReactNode
  status: ReactNode
  initialAddressHoldings: ReactNode
  deploymentAPR: ReactNode
  actions: ReactNode
  additionalDescription?: ReactNode
  additionalStatus?: ReactNode
  additionalInitialAdressHoldings?: ReactNode
  additionalDeploymentAPR?: ReactNode
}

export interface ProofResponse {
  address: string
  amount: string
  proofs: string[]
}

export interface MaxUserCanLockResponse {
  address: string
  amount: string
}

type WithOverwrites<T> = T extends object
  ? {
      // Original keys, marked as optional, recursively applied.
      [K in keyof T]?: WithOverwrites<T[K]>
    } & {
      // $-prefixed keys, also optional.
      [K in keyof T as `$${string & K}`]?: WithOverwrites<T[K]>
    }
  : T
