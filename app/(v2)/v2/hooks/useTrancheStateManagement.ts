import { useAppState } from '@v2/state/DataProviderOnClient'
import { useCallback } from 'react'

interface UseTrancheStateManagementOptions {
  onActiveTrancheChange?: (previousIndex: number, newIndex: number) => void
}

export function useTrancheStateManagement({
  onActiveTrancheChange,
}: UseTrancheStateManagementOptions = {}) {
  const { state, dispatch } = useAppState()
  const { activeTrancheIndex } = state

  const handleActiveTrancheChange = useCallback(
    (previousIndex: number, newIndex: number) => {
      dispatch({ type: 'SET_ACTIVE_TRANCHE_INDEX', payload: newIndex })
      onActiveTrancheChange?.(previousIndex, newIndex)
    },
    [dispatch, onActiveTrancheChange],
  )

  return {
    activeTrancheIndex,
    handleActiveTrancheChange,
  }
}
