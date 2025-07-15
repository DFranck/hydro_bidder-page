import { SourceID, getEnvironment, getSource } from '@v2/environments'
import { useAppState } from '@v2/state/DataProviderOnClient'
import { AugmentedTranche } from '@v2/types'
import sortBy from 'lodash/sortBy'
import { useMemo } from 'react'

export interface TrancheWithSource extends AugmentedTranche {
  sourceId: SourceID
}

export interface TrancheInfo {
  logo: string
  name: string
  baseName: string
  suffix: string
  sourceId: SourceID
  description?: string
}

export function useTranchesSorted() {
  const { state } = useAppState()
  const { currentRoundDataPerSource } = state

  const allTranchesSorted = useMemo(() => {
    const allSources = Object.values(currentRoundDataPerSource ?? {})
    return sortBy(
      allSources.flatMap(({ sourceId, tranches }) =>
        (Array.isArray(tranches) ? tranches : []).map((tranche) => ({
          ...tranche,
          sourceId: sourceId,
        })),
      ),
      (tranche) => tranche.sourceId,
    )
  }, [currentRoundDataPerSource])

  return allTranchesSorted
}

export function getTrancheInfo(tranche: TrancheWithSource): TrancheInfo {
  const { sourceId, name, metadata } = tranche
  const { logo, description } = JSON.parse(metadata)
  const environment = getEnvironment()
  const source = getSource(environment, sourceId)
  const baseName = name.replace(
    new RegExp(` ${source.trancheSuffix}`, 'i'),
    '',
  )

  return {
    logo,
    name,
    baseName,
    suffix: source.trancheSuffix,
    sourceId,
    description,
  }
}
