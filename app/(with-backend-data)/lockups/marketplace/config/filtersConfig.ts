import { getParsedEnvList } from "@/lib/getParsedEnvList"
import { getDisplayDenom } from "../../utils/getDisplayDenom"
import { MarketplaceFilters } from "../types"

export const statusFilterOptions = [
  "for-sale",
  "not-for-sale",
  "isMine",
] as const
const allowedMarketplaceDenoms = getParsedEnvList(
  "NEXT_PUBLIC_ALLOWED_NFT_DENOMS",
)

export const marketPlaceDenomsFilter = allowedMarketplaceDenoms
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
