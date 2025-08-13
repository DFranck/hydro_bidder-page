import { useBackendData } from "@/contract-apis/useBackendData"
import { Dropdown } from "../../actions/components/Dropdown"
import { LockupActionTrigger } from "../../actions/components/LockupActionTrigger"
import { MarketplaceLockup, MarketplaceSortBy } from "../types"
import { isListedMarketplaceLockup } from "../utils/isListedMarketplaceLockup"
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

  return (
    <>
      <div className=" flex flex-wrap justify-center gap-4 p-4 md:justify-start">
        {sortedLockups.map((lockup) => {
          const isMine = isMyLockup(lockup, myMarketplaceLockups)
          if (isMine && isListedMarketplaceLockup(lockup)) {
            return (
              <Dropdown
                key={lockup.id}
                trigger={<MarketplaceLockupCard lockup={lockup} isMine />}
                className="text-gray-500 hover:text-gray-800"
              >
                {isListedMarketplaceLockup(lockup) && (
                  <LockupActionTrigger lockup={lockup} action="unlist" />
                )}
                <LockupActionTrigger lockup={lockup} action="list" />
              </Dropdown>
            )
          } else if (isMine) {
            return (
              <LockupActionTrigger
                key={lockup.id}
                lockup={lockup}
                action="list"
              >
                <MarketplaceLockupCard lockup={lockup} isMine />
              </LockupActionTrigger>
            )
          } else
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
