import { useCallback, useEffect, useState } from 'react'

interface UseTrancheFocusManagementProps {
  containerRef: React.RefObject<HTMLDivElement | null>
  activeTrancheIndex: number
  onActiveTrancheChange?: (previousIndex: number, newIndex: number) => void
  targetSelector?: string
  bidSelector?: string
}

export function useTrancheFocusManagement({
  containerRef,
  activeTrancheIndex,
  onActiveTrancheChange,
  targetSelector = '[data-carousel-section="tranche"]',
  bidSelector = '[id^="bid-card--"]',
}: UseTrancheFocusManagementProps) {
  const [trancheAndBidIdsMap, setTrancheAndBidIdsMap] = useState<
    [trancheId: string, bidIds: string[]][]
  >([])

  // Build map of tranche IDs to bid IDs for focus management
  useEffect(() => {
    const tranches = containerRef.current?.querySelectorAll(targetSelector)
    if (tranches) {
      setTrancheAndBidIdsMap(
        Array.from(tranches).map((tranche) => {
          const trancheId = tranche.id
          const bidIds = Array.from(
            tranche.querySelectorAll(bidSelector),
          ).map((bid) => bid.id)
          return [trancheId, bidIds]
        }),
      )
    }
  }, [containerRef, targetSelector, bidSelector])

  // Focus first bid when active tranche changes
  useEffect(() => {
    const bidIds = trancheAndBidIdsMap[activeTrancheIndex]?.[1]
    const bidId = bidIds?.[0]
    if (bidId) {
      document.getElementById(bidId)?.focus()
    }
  }, [activeTrancheIndex, trancheAndBidIdsMap])

  // Handle active tranche changes with focus management
  const handleActiveTrancheChange = useCallback(
    (previousIndex: number, newIndex: number) => {
      // Focus management
      const bidIds = trancheAndBidIdsMap[newIndex]?.[1]
      const bidId = bidIds?.[0]
      if (bidId) {
        document.getElementById(bidId)?.focus()
      }

      onActiveTrancheChange?.(previousIndex, newIndex)
    },
    [trancheAndBidIdsMap, onActiveTrancheChange],
  )

  return {
    handleActiveTrancheChange,
    trancheAndBidIdsMap,
  }
}
