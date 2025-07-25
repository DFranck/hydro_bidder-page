import { Listing } from "@/app/ts_types/MarketplaceBase.types"
import { AugmentedLockup } from "@/contract-apis/types"
import { filterSections, marketPlaceDenomsFilter } from "./config/filtersConfig"
import { SORT_OPTIONS } from "./config/sortConfigs"
import { MARKETPLACE_VIEWS } from "./config/viewConfig"

export type MarketplaceView = (typeof MARKETPLACE_VIEWS)[number]
export type MarketplaceSortBy = (typeof SORT_OPTIONS)[number]["value"]
export type MarketplaceStatusFilter =
  (typeof filterSections.status.options)[number]
export type MarketPlaceDenom = (typeof marketPlaceDenomsFilter)[number]

export type MarketplaceLockup = AugmentedLockup & {
  listing: Listing
}

export type TokenPrice = {
  token_symbol: string
  token_exponent: number
  token_price: number
}

export interface MarketplaceFilters {
  denoms: MarketPlaceDenom[]
  status: MarketplaceStatusFilter[]
  minScore: number
  useMinScore: boolean
  minPrice: number
  useMinPrice: boolean
  maxPrice: number
  useMaxPrice: boolean
}

export type ListingMutationAPIResponse = {
  success: boolean
  operation: "list" | "update" | "unlist" | "buy" | "noop"
  listing: Listing | null
  error?: string
}

export type LockupUnifiedHistoryItem =
  | {
      type: "vote"
      date_nanos: string | number
      round_id: number
      proposal_id: number
      trancheId?: number
    }
  | {
      type: "event"
      date_nanos: number
      action: string
      price: {
        amount: string
        denom: string
      }
    }
