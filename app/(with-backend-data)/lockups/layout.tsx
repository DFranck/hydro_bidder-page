"use client"
import { Confetti } from "@/components/Confetti"
import React, { useState } from "react"
import { MarketplaceDataProvider } from "./marketplace/context/MarketplaceDataProvider"
import { MarketplaceFiltersProvider } from "./marketplace/context/MarketplaceFiltersContext"

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [confettiTrigger, setConfettiTrigger] = useState(false)
  return (
    <MarketplaceFiltersProvider>
      <MarketplaceDataProvider
        onUpdateLocal={({ type }) => {
          if (type === "buy") {
            setConfettiTrigger(true)
          }
        }}
      >
        {children}
        <Confetti
          trigger={confettiTrigger}
          onComplete={() => setConfettiTrigger(false)}
        />
      </MarketplaceDataProvider>
    </MarketplaceFiltersProvider>
  )
}

export default Layout
