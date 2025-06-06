import { Environment, getSource, SourceID } from "@/app/(v2)/v2/environments"
import { LiquidityDeployment, Tranche } from "@/app/ts_types/HydroBase.types"
import { augmentRoundDeploymentMetrics } from "@/contract-apis/testingFiles/augmentRoundDeploymentMetrics"
import { supabase } from "@/lib/supabase"
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

  const liquidityDeployments = (await fetch(
    new URL(
      `/api/v2/liquidity_deployments/${hydroContract}/${round_id}`,
      request.url
    )
  ).then((res) => res.json())) as LiquidityDeployment[]

  // Fetch Rounds & Tranches data to iterate over
  const currentRoundIdResponse = await fetch(
    new URL(`/api/v2/current_round/${hydroContract}`, request.url)
  )
  const { round_id: currentRoundId } = await currentRoundIdResponse.json()

  const tranchesResponse = await fetch(
    new URL(`/api/v2/tranches/${hydroContract}`, request.url)
  )
  const tranches = (await tranchesResponse.json()) as Tranche[]

  // Get all tranche IDs
  const allTrancheIds = tranches.map((tranche) => tranche.id)

  // Fetch tributes and lockups for the requested round
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

  // Fetch bids for each tranche in the requested round
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

  const augmentedRoundData = augmentRoundDeploymentMetrics(
    Number(round_id),
    roundBids,
    roundLockups,
    roundTributes,
    roundPrices,
    {},
    Number(round_id),
    liquidityDeployments
  )

  const rowData = {
    hydroContract,
    round_id: Number(round_id),
    round_bids: roundBids,
    round_lockups: roundLockups,
    round_tributes: roundTributes,
    round_prices: roundPrices,
    round_deployments: liquidityDeployments,
  }

  // Check if row exists
  const { data: existingRow } = await supabase
    .from("round_data")
    .select("id")
    .eq("hydroContract", hydroContract)
    .eq("round_id", Number(round_id))
    .single()

  let error
  if (existingRow) {
    // Update existing row
    const { error: updateError } = await supabase
      .from("round_data")
      .update(rowData)
      .eq("id", existingRow.id)
    error = updateError
  } else {
    // Insert new row
    const { error: insertError } = await supabase
      .from("round_data")
      .insert(rowData)
    error = insertError
  }

  if (error) {
    console.error("Failed to write round data:", error)
    throw new Error(`Failed to write round data: ${error.message}`)
  }

  return Response.json(augmentedRoundData)
}
