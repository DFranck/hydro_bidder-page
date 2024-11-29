import {
  CamelCaseKeys,
  keysFromSnakeToCamelCase,
} from "@/lib/keysFromSnakeToCamelCase"
import { startCase } from "lodash"

export interface BidFromNumia {
  round: string
  tranche: string
  project: string
  project_url: string
  project_logo_url: string
  project_about: string
  id: string
  title: string
  description: string
  comments: string
  onchain_tribute_assets: string
  onchain_tribute_usdc: number
  offchain_tribute: string
  offchain_tribute_info: string
  voters: number
  voting_power: number
  requested_allocation_denom: string
  requested_allocation_amount: number
  initial_allocation_denom: string
  initial_allocation_amount: number
  current_allocation_denom: string
  current_allocation_amount: number
  status: string
  duration_days: number
  apr: number
}

export type SanitizedBidFromNumia = CamelCaseKeys<
  Omit<
    BidFromNumia,
    "offchain_tribute" | "onchain_tribute_assets" | "tranche" | "project"
  > & {
    projectName: string
    tranche: number
    offchain_tribute: OffchainTributeFromNumia[]
    onchain_tribute_assets: OnchainTributeFromNumia[]
  }
>
type OffchainTributeFromNumia = {
  amount: number
  type: string
}

type OnchainTributeFromNumia = {
  amount: number
  asset: string
}

const typeToTokenMap = {
  "ibc/837E876E": "SWTH",
}

function sanitizeBid(bid: BidFromNumia): SanitizedBidFromNumia {
  return keysFromSnakeToCamelCase({
    ...bid,
    projectName: bid.project,
    tranche: Number(bid.tranche),
    offchain_tribute: (
      JSON.parse(bid.offchain_tribute) as OffchainTributeFromNumia[]
    )
      .filter((t) => !!t.amount)
      .map((t) => ({ ...t, type: startCase(t.type) })),
    onchain_tribute_assets: (
      JSON.parse(bid.onchain_tribute_assets) as OnchainTributeFromNumia[]
    )
      .filter((t) => !!t.amount)
      .map((t) => {
        const asset = Object.entries(typeToTokenMap).find(([key, value]) =>
          t.asset.startsWith(key)
        )?.[1]

        return {
          ...t,
          asset: asset ?? t.asset.toUpperCase(),
        }
      }),
  })
}

export async function fetchNumiaBidData(): Promise<{
  postHydroBids: SanitizedBidFromNumia[]
  preHydroBids: SanitizedBidFromNumia[]
}> {
  const response = await fetch(
    "https://www.datalenses.zone/numia/cosmos/lensesV2/hydro/deployments_overview"
  )

  const bids = (await response.json()) as BidFromNumia[]

  const sanitizedBids = bids.map(sanitizeBid)
  const postHydroBids = sanitizedBids.filter(
    (bid) => bid.round.toLowerCase() !== "pre-hydro"
  )
  const preHydroBids = sanitizedBids.filter(
    (bid) => bid.round.toLowerCase() === "pre-hydro"
  )

  return {
    preHydroBids,
    postHydroBids,
  }
}
