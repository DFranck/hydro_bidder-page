import {
  BidFromNumia,
  OnchainTributeFromNumia,
  SanitizedBidFromNumia,
  SanitizedOffchainTributeFromNumia,
  SanitizedOnchainTributeFromNumia,
} from "@/contract-apis/types"
import { keysFromSnakeToCamelCase } from "@/lib/keysFromSnakeToCamelCase"
import startCase from "lodash/startCase"

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

  const response = await fetch(
    `${process.env.NUMIA_DEPLOYMENTS_OVERVIEW_ENDPOINT}?${new Date().getTime()}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.NUMIA_COSMOS_HYDRO_APP_API_KEY}`,
      },
    }
  )

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
