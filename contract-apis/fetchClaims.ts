import { TributeBaseQueryClient } from "@/app/ts_types/TributeBase.client"
import { TributeClaim } from "@/app/ts_types/TributeBase.types"
import { AssetListEntry } from "@/contract-apis/fetchAssetListWithPrices"
import {
  AugmentedCoin,
  getCoinWithValueInUsd,
} from "@/contract-apis/getCoinWithValueInUsd"
import { getCosmWasmClient } from "@/contract-apis/getCosmWasmClient"
import {
  CamelCaseKeys,
  keysFromSnakeToCamelCase,
} from "@/lib/keysFromSnakeToCamelCase"
import { range } from "lodash"

interface SanitizedClaim
  extends Omit<CamelCaseKeys<TributeClaim>, "proposalId"> {
  bidId: number
}

export type AugmentedClaim = Omit<SanitizedClaim, "amount"> & {
  amount: AugmentedCoin
}

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

  const client = await getCosmWasmClient()
  const tributeQueryClient = new TributeBaseQueryClient(
    client,
    process.env.NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS
  )

  let historicalClaims: SanitizedClaim[]
  let outstandingClaims: SanitizedClaim[] = []

  try {
    const fetchedHistoricalClaims =
      await tributeQueryClient.historicalTributeClaims({
        limit: 100,
        startFrom: 0,
        userAddress: address,
      })
    console.log({ fetchedHistoricalClaims })
    historicalClaims = sanitizeClaims(fetchedHistoricalClaims as any)
  } catch (error) {
    historicalClaims = []
  }

  try {
    const roundIds = range(0, currentRoundId + 1)

    const allClaims = await Promise.all(
      roundIds.map((roundId) =>
        Promise.all(
          trancheIds.map((trancheId) =>
            tributeQueryClient.outstandingTributeClaims({
              limit: 100,
              roundId,
              startFrom: 0,
              trancheId,
              userAddress: address,
            })
          )
        )
      )
    )

    outstandingClaims = allClaims
      .flat()
      .flat()
      .flatMap(({ claims }) => sanitizeClaims(claims))
  } catch (error) {
    outstandingClaims = []
  }

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
  assetListWithPrices: Record<string, AssetListEntry>
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
