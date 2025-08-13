"use client"

import { useParams } from "next/navigation"
import React, { ReactElement, useEffect, useState } from "react"
import MarketplacePage from "../page"
import { useMarketplaceData } from "../context/MarketplaceDataProvider"
import LockupActionModal from "../../actions/components/LockupActionModal"

export default function Page(): ReactElement {
  const { marketplaceLockups } = useMarketplaceData()
  const [open, setOpen] = useState(false)
  const params = useParams()

  const lockupForSale = marketplaceLockups.find(
    (lockup) => lockup.id === Number(params?.lock_id)
  )

  useEffect(() => {
    if (!lockupForSale) return
    setOpen(true)
  }, [lockupForSale])

  return (
    <React.Fragment>
      <MarketplacePage />
      {open && lockupForSale && (
        <LockupActionModal
          lockup={lockupForSale}
          action="buy"
          isOpen={open}
          isDisabled={lockupForSale.isEligibleToVote}
          onClose={() => setOpen(false)}
          onConfirm={async () => {}}
          isProcessing={false}
          showActionPanel={true}
        />
      )}
    </React.Fragment>
  )
}
