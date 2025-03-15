import {
  CamelCaseKeys,
  keysFromSnakeToCamelCase,
} from "@/lib/keysFromSnakeToCamelCase"
import startCase from "lodash/startCase"

export interface BidFromNumia {
  // Needed to link data
  id: string
  round: string
  tranche: number

  // not used; from github
  comments: string
  project_about: string
  project_logo_url: string
  project_url: string
  project: string
  title: string
  description: string

  // The more of this we get from the contract, the better
  apr: number
  current_allocation_amount: number
  duration_days: number // only used for pre-hydro bids
  initial_allocation_amount: number
  offchain_tribute_info: string
  offchain_tribute: string
  onchain_tribute_assets: string
  onchain_tribute_usdc: number
  requested_allocation_amount: number
  requested_allocation_denom: string
  status: string
  voters: number
  voting_power: number
}

export type SanitizedBidFromNumia = CamelCaseKeys<
  Omit<
    BidFromNumia,
    | "offchain_tribute"
    | "onchain_tribute_assets"
    | "tranche"
    | "project"
    | "round"
  > & {
    isOngoing: boolean
    isPending: boolean
    isRejected: boolean
    isVoting: boolean
    projectName: string
    tranche: number
    roundId: number | "pre-hydro"
    offchain_tribute: SanitizedOffchainTributeFromNumia[]
    onchain_tribute_assets: SanitizedOnchainTributeFromNumia[]
  }
>
type SanitizedOffchainTributeFromNumia = {
  amount: number
  type: string
}

type OnchainTributeFromNumia = {
  amount: number
  denom?: string
  asset?: string
}

type SanitizedOnchainTributeFromNumia = {
  amount: number
  denom: string
}

const typeToTokenMap = {
  "ibc/837E876E": "SWTH",
}

function sanitizeBid({
  project,
  round,
  ...bid
}: BidFromNumia): SanitizedBidFromNumia {
  const { status } = bid
  const isOngoing = status.toLowerCase().includes("ongoing")
  const isPending = status.toLowerCase().includes("pending")
  const isVoting = status.toLowerCase().includes("voting")
  const isRejected = status.toLowerCase().includes("rejected")

  return keysFromSnakeToCamelCase({
    ...bid,
    isOngoing,
    isPending,
    isRejected,
    isVoting,
    projectName: project,
    tranche: Number(bid.tranche),
    roundId: round.toLowerCase() === "pre-hydro" ? "pre-hydro" : Number(round),
    offchain_tribute: (
      JSON.parse(bid.offchain_tribute) as SanitizedOffchainTributeFromNumia[]
    )
      .filter((t) => !!t.amount)
      .map((t) => ({ ...t, type: startCase(t.type) })),
    onchain_tribute_assets: (
      JSON.parse(bid.onchain_tribute_assets) as OnchainTributeFromNumia[]
    )
      .filter((t) => !!t.amount)
      .map(({ denom, asset, ...t }) => {
        const actualDenom = denom ?? asset
        const token = Object.entries(typeToTokenMap).find(([key]) => {
          return actualDenom?.startsWith(key)
        })?.[1]

        return {
          ...t,
          denom: token ?? actualDenom?.toUpperCase(),
        } as SanitizedOnchainTributeFromNumia
      }),
  })
}

export async function fetchNumiaBidData(): Promise<{
  postHydroBids: SanitizedBidFromNumia[]
  preHydroBids: SanitizedBidFromNumia[]
}> {
  if (!process.env.NUMIA_DEPLOYMENTS_OVERVIEW_ENDPOINT) {
    throw new Error("NUMIA_DEPLOYMENTS_OVERVIEW_ENDPOINT is not set")
  }

  const url = new URL(process.env.NUMIA_DEPLOYMENTS_OVERVIEW_ENDPOINT)

  url.searchParams.append("timestamp", new Date().getTime().toString())

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TEMP_NUMIA_COSMOS_HYDRO_APP_API_KEY}`,
    },
  })

  const bids = (await response.json()) as BidFromNumia[]

  const sanitizedBids = bids.map(sanitizeBid)
  const postHydroBids = sanitizedBids.filter(
    (bid) => bid.roundId !== "pre-hydro"
  )
  const preHydroBids = sanitizedBids.filter(
    (bid) => bid.roundId === "pre-hydro"
  )

  return {
    preHydroBids,
    postHydroBids,
  }
}
