"use client"
import { StyledText } from "@/components/StyledText"
import { useBackendData } from "@/contract-apis/useBackendData"
import { useState } from "react"
import { Dropdown } from "../../actions/components/Dropdown"
import { LockupActionTrigger } from "../../actions/components/LockupActionTrigger"
import { MarketplaceLockup } from "../types"
import { isListedMarketplaceLockup } from "../utils/isListedMarketplaceLockup"
import { isMyLockup } from "../utils/isMyLockup"
import MarketplaceLockupCard from "./MarketplaceLockupCard"
import { Droplet, MoveDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface MarketplaceMyNftsSectionProps {
  allLockups: MarketplaceLockup[]
}

export default function MarketplaceMyNftsSection({
  allLockups,
}: MarketplaceMyNftsSectionProps) {
  const { marketplaceLockups: myMarketplaceLockups, isWalletConnected } =
    useBackendData()
  const [isExpanded, setIsExpanded] = useState(true)

  const myLockups = allLockups.filter((lockup) =>
    isMyLockup(lockup, myMarketplaceLockups)
  )

  if (!isWalletConnected || myLockups.length === 0) {
    return null
  }

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-auto items-center justify-between gap-1 p-4 text-left transition-colors hover:bg-white/5"
      >
        <div className="flex items-center gap-3">
          <StyledText as="h3" variant="h4" className="text-white">
            My NFTs
          </StyledText>
          <div className="bg-palette-green/80 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-black">
            {myLockups.length}
          </div>
        </div>
        <MoveDown
          className={cn(
            "h-4 text-white/90 transition-transform",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      {isExpanded && (
        <div className="px-4">
          <div className="mb-4 border-t border-white/10"></div>
          <div className="flex flex-wrap justify-center gap-4 md:justify-start">
            {myLockups.map((lockup) => {
              let isListed = isListedMarketplaceLockup(lockup)

              if (isListed) {
                return (
                  <Dropdown
                    key={lockup.id}
                    trigger={<MarketplaceLockupCard lockup={lockup} isMine />}
                    className="text-gray-500 hover:text-gray-800"
                  >
                    <LockupActionTrigger lockup={lockup} action="unlist" />
                    <LockupActionTrigger lockup={lockup} action="list" />
                  </Dropdown>
                )
              } else {
                return (
                  <LockupActionTrigger
                    key={lockup.id}
                    lockup={lockup}
                    action="list"
                  >
                    <MarketplaceLockupCard lockup={lockup} isMine />
                  </LockupActionTrigger>
                )
              }
            })}
          </div>
          <div className="@card-is-row:table-row">
            <div
              className={cn(
                "@card-is-row:relative @card-is-row:table-cell",
                "h-bar-height-standard"
              )}
            >
              <div
                className={cn(
                  "h-full w-[100cqw]",
                  "flex items-center justify-between",
                  "gap-2",
                  "text-palette-white text-xs whitespace-nowrap",
                  "@card-is-row:absolute",
                  "@card-is-row:top-1/2",
                  "@card-is-row:-translate-y-1/2"
                )}
              >
                <div className="border-white/20 w-full border-t-2" />
                  <Droplet className="size-8" />
                <div className="border-white/20 w-full border-t-2" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
