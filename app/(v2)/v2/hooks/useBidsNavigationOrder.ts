import { SourceID } from '@v2/environments'
import { sortBidsInTranche } from '@v2/lib/sortBidsInTranche'
import { useAppState } from '@v2/state/DataProviderOnClient'
import { useMemo } from 'react'

export function useBidsNavigationOrder() {
  const { state } = useAppState()
  const { currentRoundDataPerSource } = state

  const navigationBidsOrder = useMemo(() => {
    const allSources = Object.values(currentRoundDataPerSource ?? {})
    const bidsWithSource = allSources.flatMap(({ sourceId, augmentedBids }) =>
      (augmentedBids ?? []).map((bid) => ({
        ...bid,
        sourceId: sourceId,
      })),
    )

    // Group by tranche
    const groupedByTranche: Record<string, typeof bidsWithSource> = {}
    bidsWithSource.forEach((bid) => {
      const trancheKey = `${bid.sourceId}-${bid.trancheId}`
      if (!groupedByTranche[trancheKey]) {
        groupedByTranche[trancheKey] = []
      }
      groupedByTranche[trancheKey].push(bid)
    })

    // Sort tranches by their ID (ascending)
    const sortedTranches = Object.entries(groupedByTranche).sort(
      ([aKey], [bKey]) => {
        const aId = parseInt(aKey.split('-')[1], 10)
        const bId = parseInt(bKey.split('-')[1], 10)
        return aId - bId
      }
    )

    // Bids within each tranche are sorted by vote_perc (descending) via sortBidsInTranche
    return sortedTranches.flatMap(([trancheKey, bids]) =>
      sortBidsInTranche(bids)
    )
  }, [currentRoundDataPerSource])

  return navigationBidsOrder
}

export function useBidsNavigation(bidId: number) {
  const navigationBidsOrder = useBidsNavigationOrder()
  const { state } = useAppState()
  const { isLoading } = state

  // Don't calculate navigation if still loading
  if (isLoading || navigationBidsOrder.length === 0) {
    return {
      navigationBidsOrder,
      currentBidIndex: -1,
      previousBid: null,
      nextBid: null,
      hasPreviousBid: false,
      hasNextBid: false,
    }
  }

  const currentBidIndex = navigationBidsOrder.findIndex((bid) => bid.id === bidId)

  // If bid is not found, return early with safe defaults
  if (currentBidIndex === -1) {
    return {
      navigationBidsOrder,
      currentBidIndex: -1,
      previousBid: null,
      nextBid: null,
      hasPreviousBid: false,
      hasNextBid: false,
    }
  }

  const previousBid =
    currentBidIndex > 0 ? navigationBidsOrder[currentBidIndex - 1] : null
  const nextBid =
    currentBidIndex < navigationBidsOrder.length - 1
      ? navigationBidsOrder[currentBidIndex + 1]
      : null

  const hasPreviousBid = !!previousBid
  const hasNextBid = !!nextBid

  return {
    navigationBidsOrder,
    currentBidIndex,
    previousBid,
    nextBid,
    hasPreviousBid,
    hasNextBid,
  }
}

export function useBidsInTranche(sourceId: SourceID, trancheId: number) {
  const { state } = useAppState()
  const { currentRoundDataPerSource } = state

  const bidsInTranche = useMemo(() => {
    const allBids = currentRoundDataPerSource?.[sourceId].augmentedBids ?? []
    return sortBidsInTranche(
      allBids.filter((bid) => bid.trancheId === trancheId),
    )
  }, [currentRoundDataPerSource, sourceId, trancheId])

  return bidsInTranche
}
