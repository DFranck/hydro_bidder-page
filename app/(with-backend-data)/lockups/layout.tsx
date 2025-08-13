"use client"
import { Listing } from "@/app/ts_types/MarketplaceBase.types"
import { Confetti } from "@/components/Confetti"
import { AugmentedLockup } from "@/contract-apis/types"
import React, { useState } from "react"
import { ListingSuccessModal } from "./actions/components/ListingSuccessModal"
import { MarketplaceDataProvider } from "./marketplace/context/MarketplaceDataProvider"
import { MarketplaceFiltersProvider } from "./marketplace/context/MarketplaceFiltersContext"
import { MarketplaceLockup } from "./marketplace/types"

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [confettiTrigger, setConfettiTrigger] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false);
  const [successLockup, setSuccessLockup] = useState<
    AugmentedLockup | MarketplaceLockup | undefined
  >(undefined);
  const [successListing, setSuccessListing] = useState<Listing | undefined>(undefined);
  return (
    <MarketplaceFiltersProvider>
      <MarketplaceDataProvider
        onUpdateLocal={({ type, lockup,listing }) => {
          if (type === "buy") {
            setConfettiTrigger(true)
          }
           if (type === "list" || type === "update") {
            setSuccessListing(listing as Listing);
            setSuccessLockup(lockup as AugmentedLockup | MarketplaceLockup);
            setSuccessOpen(true);
          }
        }}
        
      >
        {children}
        <Confetti
          trigger={confettiTrigger}
          onComplete={() => setConfettiTrigger(false)}
        /> <ListingSuccessModal
          open={successOpen}
          lockup={successLockup}
          listing={successListing}
          onClose={() => setSuccessOpen(false)}
         
        />
      </MarketplaceDataProvider>
    </MarketplaceFiltersProvider>
  )
}

export default Layout
