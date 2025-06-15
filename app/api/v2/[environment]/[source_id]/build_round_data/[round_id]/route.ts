import { LiquidityDeployment, Tranche } from "@/app/ts_types/HydroBase.types"
import { augmentRoundDeploymentMetrics } from "@/contract-apis/testingFiles/augmentRoundDeploymentMetrics"
import { supabase } from "@/lib/supabase"
import { Json } from "@/supabase/generated-types"
import { Environment, getSource, SourceID } from "@v2/environments"
import { fetchRoundBids } from "../_helpers/fetchRoundBids"
import { fetchRoundLockups } from "../_helpers/fetchRoundLockups"
import { fetchRoundPrices } from "../_helpers/fetchRoundPrices"
import { fetchRoundTributes } from "../_helpers/fetchRoundTributes"

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      environment: Environment
      source_id: SourceID
      round_id: number
    }>
  }
) {
  const { environment, source_id, round_id } = await params

  const sourceObject = getSource(environment, source_id)

  const { hydroContract, tributeContract, priceChainId } = sourceObject

  const urlPrefix = `/api/v2/${environment}/${source_id}`

  const liquidityDeployments = (await fetch(
    new URL(`${urlPrefix}/liquidity_deployments/${round_id}`, request.url)
  ).then((res) => res.json())) as LiquidityDeployment[]

  const currentRoundIdResponse = await fetch(
    new URL(`${urlPrefix}/current_round`, request.url)
  )
  const { round_id: currentRoundId } = await currentRoundIdResponse.json()

  const tranchesResponse = await fetch(
    new URL(`${urlPrefix}/tranches`, request.url)
  )
  const tranches = (await tranchesResponse.json()) as Tranche[]

  const allTrancheIds = tranches.map((tranche) => tranche.id)

  const roundTributes = await fetchRoundTributes({
    tributeContract,
    roundId: Number(round_id),
    currentRoundId: currentRoundId,
  })
  const roundLockups = await fetchRoundLockups({
    hydroContract,
    roundId: Number(round_id),
    currentRoundId: currentRoundId,
  })
  const roundPrices = await fetchRoundPrices({
    chainId: priceChainId,
    roundId: Number(round_id),
  })

  const roundBids = (
    await Promise.all(
      allTrancheIds.map(async (tranche_id) => {
        return await fetchRoundBids({
          hydroContract,
          roundId: Number(round_id),
          trancheId: tranche_id,
          currentRoundId,
        })
      })
    )
  ).flat()

  const bidDescriptionsById = await fetch(
    new URL(`/api/v2/bid_descriptions`, request.url)
  ).then((res) => res.json())

  const augmentedRoundData = augmentRoundDeploymentMetrics(
    Number(round_id),
    roundBids,
    roundLockups,
    roundTributes,
    roundPrices,
    bidDescriptionsById,
    Number(round_id),
    liquidityDeployments
  )

  const augmentedBidsToUpsert = augmentedRoundData.map((bid) => ({
    hydro_contract: hydroContract,
    bid_id: bid.id,
    round_id: Number(round_id),
    data: bid as unknown as Json,
  }))

  // Get existing records for comparison
  const { data: existingBids, error: fetchError } = await supabase
    .from("augmented_round_bids")
    .select("*")
    .eq("hydro_contract", hydroContract)
    .eq("round_id", Number(round_id))

  if (fetchError) {
    console.error("Failed to fetch existing augmented round bids:", fetchError)
    throw new Error(
      `Failed to fetch existing augmented round bids: ${fetchError.message}`
    )
  }

  // Filter out bids that haven't changed
  const existingBidsMap = new Map(
    existingBids?.map((bid) => [bid.bid_id, bid.data]) ?? []
  )
  const bidsToInsert = augmentedBidsToUpsert.filter(
    (bid) => JSON.stringify(bid.data) !== JSON.stringify(existingBidsMap.get(bid.bid_id))
  )

  if (bidsToInsert.length > 0) {
    const { error: insertError } = await supabase
      .from("augmented_round_bids")
      .insert(bidsToInsert)

    if (insertError) {
      console.error("Failed to insert augmented round bids:", insertError)
      throw new Error(
        `Failed to insert augmented round bids: ${insertError.message}`
      )
    }
  }

  return Response.json(augmentedRoundData)
}
