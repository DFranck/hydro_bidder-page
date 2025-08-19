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
    <>
      <div className=" flex flex-wrap justify-center gap-4 p-4 md:justify-start">
        {generalLockups.map((lockup) => {
          return (
            <LockupActionTrigger key={lockup.id} lockup={lockup} action="buy">
              <MarketplaceLockupCard lockup={lockup} />
            </LockupActionTrigger>
          )
        })}
      </div>
    </>
  )
}
