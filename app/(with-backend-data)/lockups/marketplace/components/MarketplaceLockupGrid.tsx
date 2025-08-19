import { useBackendData } from "@/contract-apis/useBackendData"
import { LockupActionTrigger } from "../../actions/components/LockupActionTrigger"
import { MarketplaceLockup, MarketplaceSortBy } from "../types"
import { isMyLockup } from "../utils/isMyLockup"
import { sortLockups } from "../utils/sortLockups"
import MarketplaceLockupCard from "./MarketplaceLockupCard"

interface MarketplaceLockupGridProps {
  lockups: MarketplaceLockup[]
  sortBy: MarketplaceSortBy
}

export default function MarketplaceLockupGrid({
  lockups,
  sortBy,
}: MarketplaceLockupGridProps) {
  const { marketplaceLockups: myMarketplaceLockups } = useBackendData()
  const sortedLockups = sortLockups(lockups, sortBy)

  const generalLockups = sortedLockups.filter(
    (lockup) => !isMyLockup(lockup, myMarketplaceLockups)
  )

  return (
    <div className="mt-16">
      <div className="flex items-center gap-3 px-4">
        <h4 className="text-2xl font-bold">Others</h4>
        <div className="bg-palette-green/80 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-black">
          {generalLockups.length}
        </div>
      </div>
      <div className=" flex flex-wrap justify-center gap-4 p-4 md:justify-start">
        {generalLockups.map((lockup) => {
          return (
            <LockupActionTrigger key={lockup.id} lockup={lockup} action="buy">
              <MarketplaceLockupCard lockup={lockup} />
            </LockupActionTrigger>
          )
        })}
      </div>
    </div>
  )
}
