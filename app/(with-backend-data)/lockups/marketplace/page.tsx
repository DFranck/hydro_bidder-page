"use client"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { useState } from "react"
import { twMerge } from "tailwind-merge"
import MarketplaceFilters from "./components/MarketplaceFilters"
import MarketplaceHeader from "./components/MarketplaceHeader"
import MarketplaceLockupGrid from "./components/MarketplaceLockupGrid"
import { useMarketplaceData } from "./context/MarketplaceDataProvider"
import { MarketplaceSortBy, MarketplaceView } from "./types"


export default function MarketplacePage() {
  const [view, setView] = useState<MarketplaceView>("grid")
  const [sortBy, setSortBy] = useState<MarketplaceSortBy>("price-asc")
  const [isAsideOpen, setIsAsideOpen] = useState(false)
  const { marketplaceLockups, filteredLockups } = useMarketplaceData()

  const isLoading =
    marketplaceLockups.length === 0 && filteredLockups.length === 0

  return (
    <>
      <div className="hidden min-h-screen bg-black text-white md:flex">
        <aside
          className={twMerge(
            "relative  shrink-0 border-r-2 border-black bg-white/10 ",
            "transition-all duration-300 ease-in-out",
            // "md:w-64 md:translate-x-0 md:p-4 md:opacity-100",
            `${!isAsideOpen ? "w-0 -translate-x-64 p-0 opacity-100" : "w-64 translate-x-0 p-4 opacity-100"}`,
          )}
        >
          <MarketplaceFilters lockups={marketplaceLockups} />
        
  </aside>
        <main className={`flex-1 relative`}>
          <MarketplaceHeader
            setView={setView}
            setSortBy={setSortBy}
            isAsideOpen={isAsideOpen}
            setIsAsideOpen={setIsAsideOpen}
            results={filteredLockups.length}
          />
          {isLoading ? (
            <div className="flex h-full w-full -translate-y-20 items-center justify-center text-sm text-white/60">
              <LoadingSpinner isLoading={isLoading} />
            </div>
          ) : view === "grid" && filteredLockups.length > 0 ? (
            <MarketplaceLockupGrid lockups={filteredLockups} sortBy={sortBy} />
          ) : (
            <div className="flex h-full w-full -translate-y-20 items-center justify-center text-sm text-white/40">
              No lockups found with current filters.
            </div>
          )}
        </main>
      </div>
      <div className="flex min-h-screen flex-col bg-black text-white md:hidden">
        <MarketplaceHeader
          setView={setView}
          setSortBy={setSortBy}
          isAsideOpen={isAsideOpen}
          setIsAsideOpen={setIsAsideOpen}
          results={filteredLockups.length}
        />
        <div className="flex flex-1">
          <aside
            className={twMerge(
              "w-full shrink-0 border-r-2 border-black bg-white/10 p-4",
              "transition-all duration-300 ease-in-out",
              `${!isAsideOpen ? "w-0 -translate-x-full p-0 opacity-0" : "translate-x-0 p-4 opacity-100"}`,
            )}
          >
            <MarketplaceFilters lockups={marketplaceLockups} />
          </aside>

          <main className="w-full flex-1">
            {isLoading ? (
              <div className="flex h-full w-full -translate-y-20 items-center justify-center text-sm text-white/60">
                <LoadingSpinner isLoading={isLoading} />
              </div>
            ) : view === "grid" && filteredLockups.length > 0 ? (
              <MarketplaceLockupGrid
                lockups={filteredLockups}
                sortBy={sortBy}
              />
            ) : (
              <div className="flex h-full w-full -translate-y-20 items-center justify-center text-sm text-white/40">
                No lockups found with current filters.
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  )
}
