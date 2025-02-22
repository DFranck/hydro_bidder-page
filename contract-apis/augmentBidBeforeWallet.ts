import { Proposal } from "@/app/ts_types/HydroBase.types"
import { getAPR } from "@/contract-apis/getAPR"
import { getCoinWithValueInUsd } from "@/contract-apis/getCoinWithValueInUsd"
import {
  AugmentedBidBeforeWallet,
  RawBackendDataBeforeWallet,
} from "@/contract-apis/types"
import { keysFromSnakeToCamelCase } from "@/lib/keysFromSnakeToCamelCase"
import { omit, sumBy } from "lodash"

export function augmentBidBeforeWallet({
  bid,
  rawBackendDataBeforeWallet,
  totalPowerByRoundId,
}: {
  bid: Proposal
  rawBackendDataBeforeWallet: RawBackendDataBeforeWallet
  totalPowerByRoundId: Record<number, number>
}): AugmentedBidBeforeWallet {
  const {
    hydroData: {
      constants: { lock_epoch_length },
      liquidity_deployments,
      tributes,
    },
    externalData: { assetListWithPrices, bidDescriptionsByBidId, numiaBids },
  } = rawBackendDataBeforeWallet

  const { deployment_duration, proposal_id, round_id, ...rest } = bid

  const atomPrice =
    assetListWithPrices[
      "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9"
    ]?.priceUsd ?? 0

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
        bidDescriptionsByBidId[numiaBid.id]
    )
    .map((numiaBid) => {
      const bidDescriptionFromGithub = bidDescriptionsByBidId[numiaBid.id]

      const hasPoints =
        bidDescriptionFromGithub.points &&
        Array.isArray(bidDescriptionFromGithub.points)

      if (!hasPoints) {
        return null
      }

      const [amount, denom] = bidDescriptionFromGithub.points!
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

  const bidDescriptionFromGithub = bidDescriptionsByBidId[bid.proposal_id]
  const description = bidDescriptionFromGithub?.description ?? bid.description
  const title = bidDescriptionFromGithub?.title ?? bid.title
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
    description,
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
