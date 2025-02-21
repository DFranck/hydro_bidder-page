import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import { Tranche } from "@/app/ts_types/HydroBase.types"
import { AssetListEntry } from "@/contract-apis/fetchAssetListWithPrices"
import {
  AugmentedBidFromContract,
  SanitizedPointBasedTribute,
  SanitizedTokenBasedTribute,
} from "@/contract-apis/fetchBackendDataBeforeWallet"
import { BidDescription } from "@/contract-apis/fetchBidDescriptions"
import {
  augmentLiquidityDeployment,
  fetchLiquidityDeployments,
} from "@/contract-apis/fetchLiquidityDeployments"
import { SanitizedBidFromNumia } from "@/contract-apis/fetchNumiaBidData"
import { fetchProposalTributes } from "@/contract-apis/fetchProposalTributes"
import { getCoinWithValueInUsd } from "@/contract-apis/getCoinWithValueInUsd"
import { getCosmWasmClient } from "@/contract-apis/getCosmWasmClient"
import { keysFromSnakeToCamelCase } from "@/lib/keysFromSnakeToCamelCase"
import { range, sumBy } from "lodash"

export async function fetchBidsBeforeWallet({
  assetListWithPrices,
  bidDescriptionsByBidId,
  currentRoundId,
  tranches,
  lockedAtomEpochInNanos,
  atomPrice,
  postHydroBids,
}: {
  assetListWithPrices: Record<string, AssetListEntry>
  bidDescriptionsByBidId: Record<string, BidDescription>
  currentRoundId: number
  tranches: Tranche[]
  lockedAtomEpochInNanos: number
  atomPrice: number
  postHydroBids: SanitizedBidFromNumia[]
}) {
  if (!process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS) {
    throw new Error("Hydro contract address not set")
  }

  const client = await getCosmWasmClient()

  const hydroQueryClient = new HydroBaseQueryClient(
    client,
    process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
  )

  const allRoundIds = range(0, currentRoundId + 1)

  const bids: AugmentedBidFromContract[] = (
    await Promise.all(
      allRoundIds.map((roundId) =>
        Promise.all(
          tranches.map(async (tranche) => {
            const { proposals: unsanitizedBids } =
              await hydroQueryClient.roundProposals({
                limit: 50,
                roundId,
                startFrom: 0,
                trancheId: tranche.id,
              })

            const topNProposals = await hydroQueryClient.topNProposals({
              numberOfProposals: 50,
              roundId,
              trancheId: tranche.id,
            })

            const sanitizedTokenBasedTributes: SanitizedTokenBasedTribute[] = (
              await Promise.all(
                unsanitizedBids.map((bid) =>
                  fetchProposalTributes(roundId, tranche.id, bid.proposal_id)
                )
              )
            )
              .flat()
              .map(keysFromSnakeToCamelCase)
              .map(({ funds, proposalId, tributeId, ...tribute }) => {
                const fundsWithPrice = getCoinWithValueInUsd({
                  coin: funds,
                  assetListWithPrices,
                })

                return {
                  ...tribute,
                  id: tributeId,
                  amount: fundsWithPrice.printableAmount,
                  bidId: proposalId,
                  denomOriginal: funds.denom,
                  denom: fundsWithPrice.humanReadableDenom,
                  isTokenBased: true as const,
                  priceUsd: fundsWithPrice.priceUsd,
                  valueUsd: fundsWithPrice.valueUsd,
                }
              })
              .filter((tribute) => tribute.amount > 0)

            const sanitizedPointBasedTributes: SanitizedPointBasedTribute[] =
              unsanitizedBids
                .map((bid) => {
                  const bidDescriptionFromGithub =
                    bidDescriptionsByBidId[bid.proposal_id]

                  if (!bidDescriptionFromGithub) {
                    return null
                  }

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
                    bidId: bid.proposal_id,
                    denom,
                    isTokenBased: false as const,
                    roundId,
                    trancheId: tranche.id,
                    priceUsd: assetPrice,
                    valueUsd: (amount / 10 ** decimals) * assetPrice,
                  }
                })
                .filter((b) => b !== null)

            const liquidityDeployments =
              (await fetchLiquidityDeployments({
                roundId,
                trancheId: tranche.id,
              })) ?? []

            const augmentedLiquidityDeployments = liquidityDeployments.map(
              (liquidityDeployment) =>
                augmentLiquidityDeployment({
                  assetListWithPrices,
                  liquidityDeployment,
                })
            )

            const totalPower = unsanitizedBids.reduce(
              (acc, bid) => acc + Number(bid.power),
              0
            )

            // Add tributes and liquidity deployments to every bid
            const augmentedBids = unsanitizedBids
              .map(keysFromSnakeToCamelCase)
              .map(({ deploymentDuration, proposalId, ...bid }) => {
                const matchingTopProposal = topNProposals.proposals.find(
                  (topProposal) => topProposal.proposal_id === proposalId
                )
                const bidDescriptionFromGithub =
                  bidDescriptionsByBidId[proposalId]
                const description =
                  bidDescriptionFromGithub?.description ?? bid.description
                const title = bidDescriptionFromGithub?.title ?? bid.title
                const bidTributes = [
                  ...sanitizedTokenBasedTributes,
                  ...sanitizedPointBasedTributes,
                ].filter((tribute) => tribute.bidId === proposalId)
                const liquidityDeployment =
                  augmentedLiquidityDeployments.find(
                    (deployment) => deployment.bidId === proposalId
                  ) ?? null
                const bidFromNumia =
                  postHydroBids.find((bid) => Number(bid.id) === proposalId) ??
                  null
                const onchainTributeUsdc = sumBy(bidTributes, "valueUsd") ?? 0
                const polSize = bidFromNumia?.currentAllocationAmount ?? 0
                const tributeApr =
                  polSize > 0
                    ? (onchainTributeUsdc * 12) / (polSize * atomPrice)
                    : 0
                const deploymentDurationInEpochs = deploymentDuration
                const deploymentDurationInNanos =
                  deploymentDurationInEpochs * lockedAtomEpochInNanos

                return {
                  ...bid,
                  id: proposalId,
                  deploymentDurationInEpochs,
                  deploymentDurationInNanos,
                  description,
                  liquidityDeployment,
                  // if totalPower is 0, percentage is 0 (avoid division by 0)
                  percentage:
                    totalPower > 0 ? (Number(bid.power) / totalPower) * 100 : 0,
                  title,
                  tributes: bidTributes,
                  tributeApr,
                }
              })

            return augmentedBids
          })
        )
      )
    )
  )
    .flat()
    .flat()

  return bids
}
