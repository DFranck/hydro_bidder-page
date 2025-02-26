import { typeToTokenMap } from "@/contract-apis/fetchNumiaBidData"
import {
  AugmentedBidFromNumia,
  AugmentedBidFromNumiaSlimmed,
  OnchainTributeFromNumia,
  RawNumiaBidSlimmed,
  SanitizedOffchainTributeFromNumia,
  SanitizedOnchainTributeFromNumia,
} from "@/contract-apis/types"
import { keysFromSnakeToCamelCase } from "@/lib/keysFromSnakeToCamelCase"
import find from "lodash/find"
import flow from "lodash/flow"
import partition from "lodash/partition"
import startCase from "lodash/startCase"

export function augmentNumiaBids(rawNumiaBids: RawNumiaBidSlimmed[]): {
  preHydroBids: AugmentedBidFromNumiaSlimmed[]
  postHydroBids: AugmentedBidFromNumiaSlimmed[]
} {
  const augmentedNumiaBids = rawNumiaBids.map(
    ({
      duration_days,
      offchain_tribute,
      onchain_tribute_assets,
      project,
      round,
      status,
      tranche,
      ...rest
    }) => {
      const isOngoing = status.toLowerCase().includes("ongoing")
      const isPending = status.toLowerCase().includes("pending")
      const isVoting = status.toLowerCase().includes("voting")
      const isRejected = status.toLowerCase().includes("rejected")

      return {
        ...keysFromSnakeToCamelCase(rest),
        durationDays: Number(duration_days),
        isOngoing,
        isPending,
        isRejected,
        isVoting,
        projectName: project,
        roundId:
          round.toLowerCase() === "pre-hydro" ? "pre-hydro" : Number(round),
        tranche: Number(tranche),
        offchainTribute: flow([
          JSON.parse,
          (arr: SanitizedOffchainTributeFromNumia[]) =>
            arr
              .filter((t) => !!t.amount)
              .map((t) => ({ ...t, type: startCase(t.type) })),
        ])(offchain_tribute) as SanitizedOffchainTributeFromNumia[],
        onchainTributeAssets: flow([
          JSON.parse,
          (arr: OnchainTributeFromNumia[]) =>
            arr
              .filter((t) => !!t.amount)
              .map(({ denom, asset, ...t }) => ({
                ...t,
                denom:
                  find(
                    typeToTokenMap,
                    (_, key) => (denom ?? asset)?.startsWith(key) ?? false
                  ) ?? (denom ?? asset)?.toUpperCase(),
              })),
        ])(onchain_tribute_assets) as SanitizedOnchainTributeFromNumia[],
      } as AugmentedBidFromNumia
    }
  )

  const [preHydroBids, postHydroBids] = partition(
    augmentedNumiaBids,
    (bid) => bid.roundId === "pre-hydro"
  )

  return {
    preHydroBids,
    postHydroBids,
  }
}
