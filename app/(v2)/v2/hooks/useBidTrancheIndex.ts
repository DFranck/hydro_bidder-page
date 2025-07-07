import { useBidsNavigationOrder } from '@v2/hooks/useBidsNavigationOrder'
import { useTranchesSorted } from '@v2/hooks/useTranchesSorted'
import { useMemo } from 'react'

export function useBidTrancheIndex(bidId: number) {
  const navigationBidsOrder = useBidsNavigationOrder()
  const allTranchesSorted = useTranchesSorted()

  const currentBidTrancheIndex = useMemo(() => {
    const currentBid = navigationBidsOrder.find((bid) => bid.id === bidId)
    if (!currentBid) return 0

    return allTranchesSorted.findIndex(
      (tranche) =>
        tranche.sourceId === currentBid.sourceId &&
        tranche.id === currentBid.trancheId,
    )
  }, [navigationBidsOrder, allTranchesSorted, bidId])

  return currentBidTrancheIndex
}
