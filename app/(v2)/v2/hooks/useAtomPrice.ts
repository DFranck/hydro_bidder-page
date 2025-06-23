import { useAppState } from '@v2/state/DataProviderOnClient'

export function useAtomPrice(): number {
  const { state } = useAppState()
  const { currentRoundDataPerSource } = state

  return Object.values(currentRoundDataPerSource ?? {}).find(
    (sourceData) => sourceData.atomPrice
  )?.atomPrice ?? 10
}
