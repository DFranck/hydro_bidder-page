"use client"
import { createContext, PropsWithChildren, useContext, useState } from "react"
import { DEFAULT_FILTERS } from "../config/filtersConfig"
import {
  MarketPlaceDenom,
  MarketplaceFilters,
  MarketplaceStatusFilter,
} from "../types"

const FiltersContext = createContext<{
  filters: MarketplaceFilters
  toggleDenom: (denom: MarketPlaceDenom) => void
  toggleStatus: (status: MarketplaceStatusFilter) => void
  setMinScore: (val: number) => void
  setMinPrice: (val: number) => void
  setMaxPrice: (val: number) => void
  setUseMinScore: (val: boolean) => void
  setUseMinPrice: (val: boolean) => void
  setUseMaxPrice: (val: boolean) => void
} | null>(null)

export function MarketplaceFiltersProvider({ children }: PropsWithChildren) {
  const [filters, setFilters] = useState<MarketplaceFilters>(DEFAULT_FILTERS)

  const toggleDenom = (denom: MarketPlaceDenom) => {
    setFilters((prev) => {
      return {
        ...prev,
        denoms: prev.denoms.includes(denom)
          ? prev.denoms.filter((d) => d !== denom)
          : [...prev.denoms, denom],
      }
    })
  }

  const toggleStatus = (status: MarketplaceStatusFilter) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...prev.status, status],
    }))
  }

  const setMinScore = (val: number) =>
    setFilters((prev) => ({ ...prev, minScore: val }))

  const setMinPrice = (val: number) =>
    setFilters((prev) => ({ ...prev, minPrice: val }))

  const setMaxPrice = (val: number) =>
    setFilters((prev) => ({ ...prev, maxPrice: val }))

  const setUseMinScore = (val: boolean) =>
    setFilters((prev) => ({ ...prev, useMinScore: val }))

  const setUseMinPrice = (val: boolean) =>
    setFilters((prev) => ({ ...prev, useMinPrice: val }))

  const setUseMaxPrice = (val: boolean) =>
    setFilters((prev) => ({ ...prev, useMaxPrice: val }))

  return (
    <FiltersContext.Provider
      value={{
        filters,
        toggleDenom,
        toggleStatus,
        setMinScore,
        setMinPrice,
        setMaxPrice,
        setUseMinScore,
        setUseMinPrice,
        setUseMaxPrice,
      }}
    >
      {children}
    </FiltersContext.Provider>
  )
}

export const useMarketplaceFilters = () => {
  const ctx = useContext(FiltersContext)
  if (!ctx) throw new Error("useMarketplaceFilters must be used in Provider")
  return ctx
}
