import { getTrancheInfo, TrancheWithSource } from '@v2/hooks/useTranchesSorted'
import Image from 'next/image'

interface CreateTrancheTabsOptions {
  allTranchesSorted: TrancheWithSource[]
  filterFunction?: (
    tranche: TrancheWithSource,
    trancheInfo: ReturnType<typeof getTrancheInfo>,
  ) => boolean
}

export function createTrancheTabs({
  allTranchesSorted,
  filterFunction,
}: CreateTrancheTabsOptions) {
  return allTranchesSorted
    .map((tranche) => {
      const trancheInfo = getTrancheInfo(tranche)

      // Apply filter if provided
      if (filterFunction && !filterFunction(tranche, trancheInfo)) {
        return null
      }

      return {
        id: `${tranche.sourceId}-${tranche.id}`,
        label: trancheInfo.baseName,
        icon: (
          <span className="absolute inset-0">
            <Image
              src={`/images/logo-${trancheInfo.logo}.svg`}
              alt={trancheInfo.name}
              fill={true}
              sizes="10vw"
            />
          </span>
        ),
        disabled: false,
        dataProps: {
          'data-has-voted-within': tranche.userVotedInTranche
            ? 'true'
            : undefined,
        },
      }
    })
    .filter((tab): tab is NonNullable<typeof tab> => tab !== null)
}
