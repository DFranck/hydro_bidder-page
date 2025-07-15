import { Tranche } from '@/app/ts_types/HydroBase.types'
import { BidMetaData, RoundPrices } from '@/contract-apis/types'
import { augmentBidsWithVoteData } from '@v2/lib/augmentBidsWithVoteData'
import { calculateUserVotedInTranche } from '@v2/lib/calculateUserVotedInTranche'
import { AugmentedTranche, SourceID } from '@v2/types'
import { useMemo } from 'react'

interface RawHydroData {
  sourceId: SourceID
  data: {
    constants: any
    totalLockedTokens: number
    currentRound: any
    tranches: Tranche[]
    augmentedBids: any[]
    walletData?: any
    roundPrices?: RoundPrices
    atomPrice?: number
  }
}

interface ProcessedData {
  currentRoundDataPerSource: Record<SourceID, any> | null
  filteredBidDescriptions: Record<number, BidMetaData>
  isLoading: boolean
}

export function useProcessedData(
  hydroData: RawHydroData[] | null,
  bidDescriptions: Record<number, BidMetaData>,
): ProcessedData {
  const staticDataPerSource = useMemo(() => {
    if (!hydroData || !Array.isArray(hydroData)) return null

    const result = Object.fromEntries(
      hydroData.map(({ sourceId, data }) => {
        const currentRoundEndDate = data.currentRound?.round_end
          ? new Date(Number(data.currentRound.round_end) / 1e6)
          : new Date()
        const lockedAtomEpochInNanos = data.constants?.lock_epoch_length ?? 7 * 24 * 60 * 60 * 1e9

        return [
          sourceId,
          {
            sourceId,
            currentRoundId: data.currentRound?.round_id ?? 0,
            roundEnd: data.currentRound?.round_end ? new Date(Number(data.currentRound.round_end) / 1e6).toISOString() : '',
            tranches: data.tranches ?? [],
            augmentedBids: data.augmentedBids ?? [],
            totalLockedTokens: data.totalLockedTokens ?? 0,
            constants: data.constants,
            roundPrices: data.roundPrices,
            atomPrice: data.atomPrice,
            _currentRoundEndDate: currentRoundEndDate,
            _lockedAtomEpochInNanos: lockedAtomEpochInNanos,
          },
        ]
      }),
    ) as Record<SourceID, any>

    return result
  }, [hydroData])

  const currentRoundDataPerSource = useMemo(() => {
    if (!staticDataPerSource || !hydroData || !Array.isArray(hydroData)) return null

    const result = Object.fromEntries(
      hydroData.map(({ sourceId, data }) => {
        const staticData = staticDataPerSource[sourceId]

        const augmentedTranches: AugmentedTranche[] =
          (Array.isArray(staticData.tranches) ? staticData.tranches : []).map((tranche: Tranche) => {
            const { userVotedInTranche, userVotedOnBidId } =
              calculateUserVotedInTranche(
                tranche,
                staticData.augmentedBids ?? [],
                data.walletData,
              )

            return {
              ...tranche,
              userVotedInTranche,
              userVotedOnBidId,
            }
          })

        const { augmentedBids, augmentedLockups } = augmentBidsWithVoteData(
          staticData.augmentedBids ?? [],
          data.walletData,
          staticData.currentRoundId,
          staticData._currentRoundEndDate,
          staticData._lockedAtomEpochInNanos,
        )

        return [
          sourceId,
          {
            ...staticData,
            tranches: augmentedTranches,
            augmentedBids,
            lockups: augmentedLockups,
            walletData: data.walletData ?? null,
          },
        ]
      }),
    ) as Record<SourceID, any>

    return result
  }, [staticDataPerSource, hydroData])

  const filteredBidDescriptions = useMemo(() => {
    if (!currentRoundDataPerSource) return bidDescriptions

    return Object.fromEntries(
      Object.entries(bidDescriptions).filter(([id, metadata]) => {
        const bidId = parseInt(id)
        return Object.values(currentRoundDataPerSource).some((sourceData) =>
          sourceData.augmentedBids?.some((bid: any) => bid.id === bidId),
        )
      }),
    )
  }, [currentRoundDataPerSource, bidDescriptions])

  const isLoading = hydroData === null

  return {
    currentRoundDataPerSource,
    filteredBidDescriptions,
    isLoading,
  }
}
