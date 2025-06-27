import {
  AugmentedBackendDataBeforeWallet,
  BackendDataBeforeWalletSlimmed,
  GlobalLockupCapacityInfo,
} from "@/contract-apis/types"
import { keysFromSnakeToCamelCase } from "@/lib/keysFromSnakeToCamelCase"
import keyBy from "lodash/keyBy"
import { augmentRoundDeploymentMetrics } from "./testingFiles/augmentRoundDeploymentMetrics"
import { TOKEN_DENOMS } from "@/lib/tokenDenoms"

export function augmentBackendDataBeforeWallet(
  rawBackendDataBeforeWallet: BackendDataBeforeWalletSlimmed
): AugmentedBackendDataBeforeWallet {
  // Extract data
  const { hydroMetaData, hydroRoundData, externalData } =
    rawBackendDataBeforeWallet

  const { constants, round_end, round_id, tranches, liquidity_deployments } =
    hydroMetaData

  const { bidMetaDataById, preHydroBids, numiaMetrics } = externalData

  const hydroRoundsData = hydroRoundData
  const currentRoundId = round_id

  // Aux Fields
  const currentRoundEndDate = new Date(Number(round_end) / 1e6)

  // New Bids Info
  const bidsInfo = hydroRoundsData
    .map(
      ({
        round_id,
        round_bids,
        round_lockups,
        round_tributes,
        round_prices,
      }) => {
        const roundParsedBids = augmentRoundDeploymentMetrics(
          round_id,
          round_bids,
          round_lockups,
          round_tributes,
          round_prices,
          bidMetaDataById,
          currentRoundId,
          liquidity_deployments
        )
        return roundParsedBids
      }
    )
    .flat()

  const atomPrice =
    hydroRoundsData[round_id]?.round_prices[TOKEN_DENOMS.ATOM]?.token_price ?? 0

  const dAtomPrice =
    hydroRoundsData[round_id]?.round_prices[TOKEN_DENOMS.dATOM]?.token_price ??
    0

  const stAtomPrice =
    hydroRoundsData[round_id]?.round_prices[TOKEN_DENOMS.stATOM]?.token_price ??
    0

  return {
    currentRoundPrices: hydroRoundsData[round_id]?.round_prices,
    atomPrice,
    dAtomPrice,
    stAtomPrice,
    bidsInfo: keyBy(bidsInfo, "id"),
    currentRoundEndDate,
    currentRoundId: round_id,
    currentRoundIsPilot: true,
    lockedAtomEpochInNanos: constants.lock_epoch_length,
    metricsForPreHydroBids: preHydroBids,
    metricsGlobal: keysFromSnakeToCamelCase(numiaMetrics),
    minTributeFactor: 0.0001, // TODO: get this from contract
    tranches,
  }
}
