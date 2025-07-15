import { useBidsNavigationOrder } from '@v2/hooks/useBidsNavigationOrder'
import { useTranchesSorted } from '@v2/hooks/useTranchesSorted'
import { useMemo } from 'react'

export function useBidsByTranche() {
  const navigationBidsOrder = useBidsNavigationOrder()
  const allTranchesSorted = useTranchesSorted()

  const bidsByTranche = useMemo(() => {
    const grouped: Record<
      string,
      { tranche: (typeof allTranchesSorted)[0]; bids: typeof navigationBidsOrder }
    > = {}

    allTranchesSorted.forEach((tranche) => {
      const trancheKey = `${tranche.sourceId}-${tranche.id}`
      const trancheBids = navigationBidsOrder.filter(
        (bid) =>
          bid.sourceId === tranche.sourceId && bid.trancheId === tranche.id,
      )
      if (trancheBids.length > 0) {
        grouped[trancheKey] = {
          tranche,
          bids: trancheBids,
        }
      }
    })

    return grouped
  }, [allTranchesSorted, navigationBidsOrder])

  return {
    bidsByTranche,
    navigationBidsOrder,
    allTranchesSorted,
  }
}
