"use server"

import { TributeBaseQueryClient } from "@/app/ts_types/TributeBase.client"
import { TributeClaim } from "@/app/ts_types/TributeBase.types"
import { getEndpoints } from "@/config"
import { getCoinWithValueInUsd } from "@/contract-apis/getCoinWithValueInUsd"
import { getCosmWasmClient } from "@/contract-apis/getCosmWasmClient"
import {
  AssetListWithPrices,
  AugmentedClaim,
  SanitizedClaim,
} from "@/contract-apis/types"
import { keysFromSnakeToCamelCase } from "@/lib/keysFromSnakeToCamelCase"
import range from "lodash/range"

export async function fetchClaims({
  address,
  currentRoundId,
  trancheIds,
}: {
  address: string
  currentRoundId: number
  trancheIds: number[]
}): Promise<{
  historicalClaims: SanitizedClaim[]
  outstandingClaims: SanitizedClaim[]
}> {
  if (!process.env.NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS) {
    throw new Error("Tribute contract address not set")
  }

  const neutronRpcEndpoint = getEndpoints({
    environmentVariables: {
      NUMIA_COSMOS_HYDRO_APP_API_KEY:
        process.env.NUMIA_COSMOS_HYDRO_APP_API_KEY!,
    },
  }).neutron.rpc[0]

  const client = await getCosmWasmClient({
    endpoint: neutronRpcEndpoint,
  })
  const tributeQueryClient = new TributeBaseQueryClient(
    client,
    process.env.NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS
  )

  let historicalClaims: SanitizedClaim[] = []
  let outstandingClaims: SanitizedClaim[] = []

  try {
    const { claims: fetchedHistoricalClaims } =
      await tributeQueryClient.historicalTributeClaims({
        limit: 100,
        startFrom: 0,
        userAddress: address,
      })

    historicalClaims = sanitizeClaims(fetchedHistoricalClaims as any)
  } catch (error) {
    historicalClaims = []
  }

  const roundIds = range(0, currentRoundId + 1)

  const allClaims = await Promise.all(
    roundIds.map(async (roundId) =>
      Promise.all(
        trancheIds.map(async (trancheId) => {
          try {
            const result = await tributeQueryClient.outstandingTributeClaims({
              limit: 100,
              roundId,
              startFrom: 0,
              trancheId,
              userAddress: address,
            })
            return result
          } catch (error) {
            return { claims: [] }
          }
        })
      )
    )
  )

  outstandingClaims = allClaims
    .flat()
    .flat()
    .flatMap(({ claims }) => sanitizeClaims(claims))

  return {
    historicalClaims,
    outstandingClaims,
  }
}

function sanitizeClaims(claims: TributeClaim[]): SanitizedClaim[] {
  return claims.map(({ proposal_id, ...claim }) =>
    keysFromSnakeToCamelCase({
      ...claim,
      bidId: proposal_id,
    })
  )
}

export function augmentClaims({
  assetListWithPrices,
  claims,
}: {
  assetListWithPrices: AssetListWithPrices
  claims: SanitizedClaim[]
}): AugmentedClaim[] {
  return claims.map((claim) => ({
    ...claim,
    amount: getCoinWithValueInUsd({
      coin: claim.amount,
      assetListWithPrices,
    }),
  }))
}
