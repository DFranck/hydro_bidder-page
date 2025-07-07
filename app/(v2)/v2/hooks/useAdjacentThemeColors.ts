import { SourceID } from '@v2/environments'
import { useBidsNavigationOrder } from '@v2/hooks/useBidsNavigationOrder'
import { calculateBidThemeColors } from '@v2/hooks/useBidThemeColor'
import { useTranchesSorted } from '@v2/hooks/useTranchesSorted'
import { useAppState } from '@v2/state/DataProviderOnClient'
import { useMemo } from 'react'

export interface AdjacentThemeColors {
  previous: string
  next: string
}

export function useAdjacentTrancheThemeColors(
  sourceId: SourceID,
  trancheId: number,
): AdjacentThemeColors {
  const allTranchesSorted = useTranchesSorted()

  return useMemo(() => {
    const currentIndex = allTranchesSorted.findIndex(
      (tranche) => tranche.sourceId === sourceId && tranche.id === trancheId,
    )

    if (currentIndex === -1) {
      return {
        previous: 'var(--color-palette-blue)',
        next: 'var(--color-palette-blue)',
      }
    }

    const previousTranche = allTranchesSorted[currentIndex - 1]
    const nextTranche = allTranchesSorted[currentIndex + 1]

    // For tranches, we use a default theme color since they don't have individual bid states
    const defaultThemeColor = 'var(--color-palette-blue)'

    return {
      previous: previousTranche
        ? defaultThemeColor
        : 'var(--color-palette-blue)',
      next: nextTranche ? defaultThemeColor : 'var(--color-palette-blue)',
    }
  }, [allTranchesSorted, sourceId, trancheId])
}

export function useAdjacentBidThemeColors(
  sourceId: SourceID,
  bidId: number,
): AdjacentThemeColors {
  const navigationBidsOrder = useBidsNavigationOrder()
  const { state } = useAppState()
  const { currentRoundDataPerSource } = state

  return useMemo(() => {
    const currentIndex = navigationBidsOrder.findIndex(
      (bid) => bid.sourceId === sourceId && bid.id === bidId,
    )

    if (currentIndex === -1) {
      return {
        previous: 'var(--color-palette-blue)',
        next: 'var(--color-palette-blue)',
      }
    }

    const previousBid = navigationBidsOrder[currentIndex - 1]
    const nextBid = navigationBidsOrder[currentIndex + 1]

    // Use the shared calculateBidThemeColors function for each adjacent bid
    const previousThemeColor = previousBid
      ? calculateBidThemeColors(
          previousBid.sourceId,
          previousBid.id,
          currentRoundDataPerSource,
        ).themeColor
      : 'var(--color-palette-blue)'

    const nextThemeColor = nextBid
      ? calculateBidThemeColors(
          nextBid.sourceId,
          nextBid.id,
          currentRoundDataPerSource,
        ).themeColor
      : 'var(--color-palette-blue)'

    return {
      previous: previousThemeColor,
      next: nextThemeColor,
    }
  }, [navigationBidsOrder, sourceId, bidId, currentRoundDataPerSource])
}
