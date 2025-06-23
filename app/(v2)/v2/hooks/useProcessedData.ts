import { Tranche } from '@/app/ts_types/HydroBase.types'
import { BidMetaData, RoundPrices } from '@/contract-apis/types'
import { SourceID } from '@v2/environments'
import { augmentBidsWithVoteData } from '@v2/lib/augmentBidsWithVoteData'
import { calculateUserVotedInTranche } from '@v2/lib/calculateUserVotedInTranche'
import { AugmentedTranche } from '@v2/state/DataProviderOnServer'
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
  const currentRoundDataPerSource = useMemo(() => {
    if (!hydroData) return null

    return Object.fromEntries(
      hydroData.map(({ sourceId, data }) => {
        // Augment tranches with voting information
        const augmentedTranches: AugmentedTranche[] =
          data.tranches?.map((tranche: Tranche) => {
            const { userVotedInTranche, userVotedOnBidId } =
              calculateUserVotedInTranche(
                tranche,
                data.augmentedBids ?? [],
                data.walletData,
              )

            return {
              ...tranche,
              userVotedInTranche,
              userVotedOnBidId,
            }
          }) ?? []

        // Augment bids with vote button data
        const currentRoundEndDate = data.currentRound?.round_end
          ? new Date(Number(data.currentRound.round_end) / 1e6)
          : new Date()
        const lockedAtomEpochInNanos = data.constants?.lock_epoch_length ?? 7 * 24 * 60 * 60 * 1e9

        const { augmentedBids, augmentedLockups } = augmentBidsWithVoteData(
          data.augmentedBids ?? [],
          data.walletData,
          data.currentRound?.round_id ?? 0,
          currentRoundEndDate,
          lockedAtomEpochInNanos,
        )

        return [
          sourceId,
          {
            sourceId,
            currentRoundId: data.currentRound?.round_id ?? 0,
            roundEnd: data.currentRound?.round_end ? new Date(Number(data.currentRound.round_end) / 1e6).toISOString() : '',
            tranches: augmentedTranches,
            augmentedBids,
            lockups: augmentedLockups,
            totalLockedTokens: data.totalLockedTokens ?? 0,
            walletData: data.walletData ?? null,
            constants: data.constants,
            roundPrices: data.roundPrices,
            atomPrice: data.atomPrice,
          },
        ]
      }),
    ) as Record<SourceID, any>
  }, [hydroData])

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
