import { getAPR } from "@/contract-apis/getAPR"
import { getCoinWithValueInUsd } from "@/contract-apis/getCoinWithValueInUsd"
import {
  AugmentedBidBeforeWalletSlimmed,
  BackendDataBeforeWalletSlimmed,
  ProposalSlimmed,
} from "@/contract-apis/types"
import { keysFromSnakeToCamelCase } from "@/lib/keysFromSnakeToCamelCase"
import { omit, sumBy } from "lodash"

export function augmentBidBeforeWallet({
  atomPrice,
  bid,
  rawBackendDataBeforeWallet,
  totalPowerByRoundId,
}: {
  atomPrice: number
  bid: ProposalSlimmed
  rawBackendDataBeforeWallet: BackendDataBeforeWalletSlimmed
  totalPowerByRoundId: Record<number, number>
}): AugmentedBidBeforeWalletSlimmed {
  const {
    hydroMetaData: {
      constants: { lock_epoch_length },
      liquidity_deployments,
    },
    hydroRoundData,
    externalData: { assetListWithPrices, bidMetaDataById, numiaBids },
  } = rawBackendDataBeforeWallet

  const tributes = hydroRoundData.flatMap((round) => round.round_tributes)

  const { deployment_duration, proposal_id, round_id, ...rest } = bid

  const augmentedTokenBasedTributes = tributes
    .filter(
      (tribute) =>
        tribute.round_id === round_id && tribute.proposal_id === proposal_id
    )
    .map((tribute) => {
      const { funds, tribute_id } = tribute

      const fundsWithPrice = getCoinWithValueInUsd({
        coin: funds,
        assetListWithPrices,
      })

      return {
        ...keysFromSnakeToCamelCase(omit(tribute, "proposal_id")),
        id: tribute_id,
        amount: fundsWithPrice.printableAmount,
        bidId: proposal_id,
        denomOriginal: funds.denom,
        denom: fundsWithPrice.humanReadableDenom,
        isTokenBased: true as const,
        priceUsd: fundsWithPrice.priceUsd,
        valueUsd: fundsWithPrice.valueUsd,
      }
    })

  const augmentedPointBasedTributes = numiaBids
    .filter(
      (numiaBid) =>
        Number(numiaBid.round) === bid.round_id &&
        Number(numiaBid.id) === bid.proposal_id &&
        bidMetaDataById[numiaBid.id]
    )
    .map((numiaBid) => {
      const bidInfoFromGithub = bidMetaDataById[numiaBid.id]

      const hasPoints =
        bidInfoFromGithub.points && Array.isArray(bidInfoFromGithub.points)

      if (!hasPoints) {
        return null
      }

      const [amount, denom] = bidInfoFromGithub.points!
      const assetListing = assetListWithPrices[denom]
      const assetPrice = assetListing?.priceUsd ?? 0
      const decimals = assetListing?.decimals ?? 6

      return {
        amount,
        bidId: Number(numiaBid.id),
        denom,
        isTokenBased: false as const,
        roundId: Number(numiaBid.round),
        trancheId: numiaBid.tranche,
        priceUsd: assetPrice,
        valueUsd: (amount / 10 ** decimals) * assetPrice,
      }
    })
    .filter((tribute) => tribute !== null)

  const liquidityDeployment =
    liquidity_deployments.find(
      (liquidityDeployment) =>
        liquidityDeployment.round_id === bid.round_id &&
        liquidityDeployment.proposal_id === bid.proposal_id
    ) ?? null

  const augmentedDeployedFunds =
    liquidityDeployment?.deployed_funds.map((coin) =>
      getCoinWithValueInUsd({
        coin,
        assetListWithPrices,
      })
    ) ?? null

  const augmentedFundsBeforeDeployment =
    liquidityDeployment?.funds_before_deployment.map((coin) =>
      getCoinWithValueInUsd({
        coin,
        assetListWithPrices,
      })
    ) ?? null

  const augmentedLiquidityDeployment = liquidityDeployment
    ? {
        ...keysFromSnakeToCamelCase(omit(liquidityDeployment, "proposal_id")),
        bidId: proposal_id,
        deployedFunds: augmentedDeployedFunds,
        fundsBeforeDeployment: augmentedFundsBeforeDeployment,
      }
    : null

  const bidInfoFromGithub = bidMetaDataById[bid.proposal_id]
  const title = bidInfoFromGithub?.title ?? bid.title
  const bidTributes = [
    ...augmentedTokenBasedTributes,
    ...augmentedPointBasedTributes,
  ]
  const bidFromNumia =
    numiaBids.find(
      (numiaBid) =>
        Number(numiaBid.id) === proposal_id &&
        Number(numiaBid.round) === bid.round_id
    ) ?? null
  const onchainTributeUsdc = sumBy(bidTributes, "valueUsd") ?? 0
  const polSize = bidFromNumia?.current_allocation_amount ?? 0
  const tributeApr =
    polSize > 0 ? (onchainTributeUsdc * 12) / (polSize * atomPrice) : 0
  const deploymentDurationInEpochs = deployment_duration
  const deploymentDurationInNanos =
    deploymentDurationInEpochs * lock_epoch_length
  const bidPowerInAtoms = Number(bid.power) / 1e6

  const tributeAprMax = getAPR({
    amountGained: onchainTributeUsdc,
    principalAssets: (bidPowerInAtoms / 1.5) * atomPrice,
    rewardPeriodInMonths: deploymentDurationInNanos / (1e9 * 60 * 60 * 24 * 30),
  })

  const tributeAprMin = getAPR({
    amountGained: onchainTributeUsdc,
    principalAssets: bidPowerInAtoms * atomPrice,
    rewardPeriodInMonths: deploymentDurationInNanos / (1e9 * 60 * 60 * 24 * 30),
  })

  const totalPower = totalPowerByRoundId[bid.round_id] ?? 0

  return {
    ...keysFromSnakeToCamelCase(rest),
    id: proposal_id,
    roundId: bid.round_id,
    title,
    deploymentDurationInEpochs: deployment_duration,
    deploymentDurationInNanos: deployment_duration * lock_epoch_length,
    liquidityDeployment: augmentedLiquidityDeployment,
    percentage: totalPower > 0 ? (Number(bid.power) / totalPower) * 100 : 0,
    tributes: [...augmentedTokenBasedTributes, ...augmentedPointBasedTributes],
    tributeApr,
    tributeAprMax,
    tributeAprMin,
  }
}
