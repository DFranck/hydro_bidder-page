import { ALLOWED_MARKETPLACE_DENOMS } from "@/lib/tokenDenoms"
import { getDisplayDenom } from "../../utils/getDisplayDenom"
import { MarketplaceFilters } from "../types"

export const statusFilterOptions = [
  "for-sale",
  "not-for-sale",
] as const

export const marketPlaceDenomsFilter = ALLOWED_MARKETPLACE_DENOMS
  .map((denom) => getDisplayDenom(denom))
  .filter((d): d is string => Boolean(d))

export const filterSections = {
  status: {
    label: "Status",
    options: statusFilterOptions,
  },
  denoms: {
    label: "Denom",
    options: marketPlaceDenomsFilter,
  },
}

export const DEFAULT_FILTERS: MarketplaceFilters = {
  denoms: [],
  status: [],
  minScore: 0,
  useMinScore: false,
  minPrice: 10,
  useMinPrice: false,
  maxPrice: 250,
  useMaxPrice: false,
}
