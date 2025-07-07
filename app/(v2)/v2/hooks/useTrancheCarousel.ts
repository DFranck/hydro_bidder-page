import { useTranchesSorted } from '@v2/hooks/useTranchesSorted'
import { createTrancheTabs } from '@v2/lib/createTrancheTabs'
import { useAppState } from '@v2/state/DataProviderOnClient'
import { useCallback } from 'react'

interface UseTrancheCarouselOptions {
  filterFunction?: (tranche: ReturnType<typeof useTranchesSorted>[0]) => boolean
  onActiveIndexChange?: (previousIndex: number, newIndex: number) => void
}

export function useTrancheCarousel({
  filterFunction,
  onActiveIndexChange,
}: UseTrancheCarouselOptions = {}) {
  const { state, dispatch } = useAppState()
  const { activeTrancheIndex } = state
  const allTranchesSorted = useTranchesSorted()

  const tabs = createTrancheTabs({
    allTranchesSorted,
    filterFunction,
  })

  const handleActiveIndexChange = useCallback(
    (previousIndex: number, newIndex: number) => {
      dispatch({ type: 'SET_ACTIVE_TRANCHE_INDEX', payload: newIndex })
      onActiveIndexChange?.(previousIndex, newIndex)
    },
    [dispatch, onActiveIndexChange],
  )

  return {
    allTranchesSorted,
    tabs,
    activeTrancheIndex,
    handleActiveIndexChange,
  }
}
