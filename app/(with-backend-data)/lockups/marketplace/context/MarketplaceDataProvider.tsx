"use client"

import { Listing } from "@/app/ts_types/MarketplaceBase.types"
import { AugmentedLockup } from "@/contract-apis/types"
import { useBackendData } from "@/contract-apis/useBackendData"
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { ListingMutationAPIResponse, MarketplaceLockup } from "../types"
import { filterLockups } from "../utils/filterLockups"
import { getMarketplaceLockups } from "../utils/getMarketplaceLockups"
import { useMarketplaceFilters } from "./MarketplaceFiltersContext"

type MarketplaceDataContextType = {
  marketplaceLockups: MarketplaceLockup[]
  filteredLockups: MarketplaceLockup[]
  updateLocal: (lockup: MarketplaceLockup | AugmentedLockup, data: any) => void
  resetLocal: () => void
  onUpdateLocal?: (event: {
    type: ListingMutationAPIResponse["operation"]
    lockup: MarketplaceLockup | AugmentedLockup
    listing: Listing | null
  }) => void
}

const MarketplaceDataContext = createContext<MarketplaceDataContextType | null>(
  null,
)

export function MarketplaceDataProvider({
  children,
  onUpdateLocal,
}: PropsWithChildren<{
  onUpdateLocal?: MarketplaceDataContextType["onUpdateLocal"]
}>) {
  const {
    hydroLockups,
    hydroListings,
    marketplaceLockups: myMarketplaceLockups,
  } = useBackendData()
  const { filters } = useMarketplaceFilters()
  const hasInitLocalListings = useRef(false)
  const hasInitLocalLockups = useRef(false)
  const [localListings, setLocalListings] = useState<Listing[]>([])
  const [localLockups, setLocalLockups] = useState<AugmentedLockup[]>([])

  useEffect(() => {
    if (
      !hasInitLocalListings.current &&
      Array.isArray(hydroListings) &&
      hydroListings.length > 0
    ) {
      setLocalListings(hydroListings)
      hasInitLocalListings.current = true
    }
  }, [hydroListings])

  useEffect(() => {
    if (
      !hasInitLocalLockups.current &&
      Array.isArray(hydroLockups) &&
      hydroLockups.length > 0
    ) {
      setLocalLockups(hydroLockups)
      hasInitLocalLockups.current = true
    }
  }, [hydroLockups])

  const marketplaceLockups = useMemo(() => {
    const res = getMarketplaceLockups(localLockups, localListings)
    return res
  }, [localLockups, localListings])

  const filteredLockups = useMemo(() => {
    const res = filterLockups(marketplaceLockups, filters, myMarketplaceLockups)
    return res
  }, [marketplaceLockups, filters])

  const resetLocal = () => {
    setLocalListings(hydroListings)
    setLocalLockups(hydroLockups)
  }

  const updateLocal = (
    lockup: MarketplaceLockup | AugmentedLockup,
    data: {
      operation: ListingMutationAPIResponse["operation"]
      listing: Listing | null
    },
  ) => {
    function hasListingField(
      lockup: MarketplaceLockup | AugmentedLockup,
    ): lockup is MarketplaceLockup {
      return "listing" in lockup && !!lockup.listing
    }

    switch (data.operation) {
      case "update":
      case "list":
        setLocalListings((prev) => {
          const listingId =
            data.listing?.listing_id ??
            (hasListingField(lockup) ? lockup.listing?.listing_id : undefined)

          if (listingId === undefined || !data.listing) return prev

          const idx = prev.findIndex((l) => l.listing_id == listingId)

          const result =
            idx !== -1
              ? prev.map((l, i) => (i === idx ? data.listing! : l))
              : [...prev, data.listing!]

          return result
        })
        break
      case "noop":
      case "unlist":
      case "buy":
        setLocalListings((prev) => {
          const tokenId = lockup.id
          const filtered = prev.filter((l) => l.token_id !== tokenId.toString())
          return filtered
        })
        setLocalLockups((prev) =>
          prev.map((l) =>
            l.id === lockup.id ? { ...l, listing: undefined } : l,
          ),
        )
        break
    }
    onUpdateLocal?.({
      type: data.operation,
      lockup,
      listing: data.listing,
    })
  }

  return (
    <MarketplaceDataContext.Provider
      value={{
        marketplaceLockups,
        filteredLockups,
        updateLocal,
        resetLocal,
      }}
    >
      {children}
    </MarketplaceDataContext.Provider>
  )
}

export function useMarketplaceData() {
  const ctx = useContext(MarketplaceDataContext)
  if (!ctx)
    throw new Error(
      "useMarketplaceData must be used within MarketplaceDataProvider",
    )
  return ctx
}
