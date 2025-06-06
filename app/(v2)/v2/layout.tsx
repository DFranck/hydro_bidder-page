import { environments, getEnvironment } from "@/app/(v2)/v2/environments"
import { AppContextProvider } from "@/app/(v2)/v2/state/provider"
import { augmentRoundDeploymentMetrics } from "@/contract-apis/testingFiles/augmentRoundDeploymentMetrics"
import { RawHydroRoundData } from "@/contract-apis/types"
import { supabase } from "@/lib/supabase"
import keyBy from "lodash/keyBy"
import { headers } from "next/headers"
import { Suspense } from "react"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const baseUrl = await headers().then((headers) => headers.get("x-url") ?? "")
  const env = getEnvironment()
  const { sources } = environments[env]

  const bidDescriptionsByIdPromise = fetch(
    new URL(`/api/v2/bid_descriptions`, baseUrl)
  ).then((res) => res.json())

  const hydroDataPromise = Promise.all(
    sources.map(async (source) => {
      const urlPrefix = `/api/v2/${env}/${source.id}`
      const [
        constantsResponse,
        totalLockedResponse,
        currentRoundResponse,
        tranchesResponse,
      ] = await Promise.all([
        fetch(new URL(`${urlPrefix}/constants`, baseUrl)),
        fetch(new URL(`${urlPrefix}/total_locked_tokens`, baseUrl)),
        fetch(new URL(`${urlPrefix}/current_round`, baseUrl)),
        fetch(new URL(`${urlPrefix}/tranches`, baseUrl)),
      ])

      const constants = await constantsResponse.json()
      const totalLockedTokens = await totalLockedResponse.json()
      const currentRound = await currentRoundResponse.json()
      const tranches = await tranchesResponse.json()

      const liquidityDeploymentsResponse = await fetch(
        new URL(
          `${urlPrefix}/liquidity_deployments/${currentRound.round_id}`,
          baseUrl
        )
      )
      const liquidityDeployments = await liquidityDeploymentsResponse.json()

      let roundData: RawHydroRoundData

      // Query round data from Supabase for current round
      const { data: roundDataFromSupabase } = await supabase
        .from("round_data")
        .select("*")
        .eq("hydro_contract", source.hydroContract)
        .eq("round_id", currentRound.round_id)
        .single()

      if (!roundDataFromSupabase) {
        const roundDataResponse = await fetch(
          new URL(`${urlPrefix}/round_data/${currentRound.round_id}`, baseUrl)
        )
        roundData = await roundDataResponse.json()
      } else {
        roundData = roundDataFromSupabase
      }

      const bidDescriptionsById = await fetch(
        new URL(`/api/v2/bid_descriptions`, baseUrl)
      ).then((res) => res.json())

      const augmentedRoundData = augmentRoundDeploymentMetrics(
        roundData.round_id,
        roundData.round_bids,
        roundData.round_lockups,
        roundData.round_tributes ?? [],
        roundData.round_prices ?? [],
        bidDescriptionsById,
        currentRound.round_id,
        liquidityDeployments
      )

      const bids_info = keyBy(augmentedRoundData, "id")

      return {
        sourceId: source.id,
        data: {
          constants,
          total_locked_tokens: totalLockedTokens,
          current_round: currentRound,
          tranches,
          round_data: roundData ? [roundData] : [],
          bids_info,
        },
      }
    })
  )

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppContextProvider
        hydroDataPromise={hydroDataPromise}
        bidDescriptionsByIdPromise={bidDescriptionsByIdPromise}
      >
        {children}
      </AppContextProvider>
    </Suspense>
  )
}
