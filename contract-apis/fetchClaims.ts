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

interface SanitizedClaim
  extends Omit<CamelCaseKeys<TributeClaim>, "proposalId"> {
  bidId: number
}

export type AugmentedClaim = Omit<SanitizedClaim, "amount"> & {
  amount: AugmentedCoin
}

export async function fetchClaims({ address }: { address: string }): Promise<{
  claims: SanitizedClaim[]
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

  let claims: SanitizedClaim[]
  let outstandingClaims: SanitizedClaim[]

  try {
    const { claims: fetchedClaims } =
      await tributeQueryClient.historicalTributeClaims({
        limit: 10_000,
        startFrom: 0,
        userAddress: address,
      })
    claims = sanitizeClaims(fetchedClaims)
  } catch (error) {
    claims = []
  }

  try {
    const { claims: fetchedOutstandingClaims } =
      await tributeQueryClient.outstandingTributeClaims({
        limit: 10_000,
        roundId: 0,
        startFrom: 0,
        trancheId: 0,
        userAddress: address,
      })
    outstandingClaims = sanitizeClaims(fetchedOutstandingClaims)
  } catch (error) {
    outstandingClaims = []
  }

  return {
    claims,
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
  assetListWithPrices: Map<string, AssetListEntry>
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
