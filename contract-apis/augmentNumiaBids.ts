import { typeToTokenMap } from "@/contract-apis/fetchNumiaBidData"
import {
  AugmentedBidFromNumia,
  OnchainTributeFromNumia,
  RawNumiaBid,
  SanitizedOffchainTributeFromNumia,
  SanitizedOnchainTributeFromNumia,
} from "@/contract-apis/types"
import { keysFromSnakeToCamelCase } from "@/lib/keysFromSnakeToCamelCase"
import find from "lodash/find"
import flow from "lodash/flow"
import partition from "lodash/partition"
import startCase from "lodash/startCase"

export function augmentNumiaBids(rawNumiaBids: RawNumiaBid[]): {
  preHydroBids: AugmentedBidFromNumia[]
  postHydroBids: AugmentedBidFromNumia[]
} {
  const augmentedNumiaBids = rawNumiaBids.map(
    ({ project, round, ...numiaBid }) => {
      const { status } = numiaBid
      const isOngoing = status.toLowerCase().includes("ongoing")
      const isPending = status.toLowerCase().includes("pending")
      const isVoting = status.toLowerCase().includes("voting")
      const isRejected = status.toLowerCase().includes("rejected")

      return keysFromSnakeToCamelCase({
        ...numiaBid,
        isOngoing,
        isPending,
        isRejected,
        isVoting,
        projectName: project,
        tranche: Number(numiaBid.tranche),
        roundId:
          round.toLowerCase() === "pre-hydro" ? "pre-hydro" : Number(round),
        offchain_tribute: flow([
          JSON.parse,
          (arr: SanitizedOffchainTributeFromNumia[]) =>
            arr
              .filter((t) => !!t.amount)
              .map((t) => ({ ...t, type: startCase(t.type) })),
        ])(numiaBid.offchain_tribute) as SanitizedOffchainTributeFromNumia[],
        onchain_tribute_assets: flow([
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
        ])(
          numiaBid.onchain_tribute_assets
        ) as SanitizedOnchainTributeFromNumia[],
      }) as AugmentedBidFromNumia
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
