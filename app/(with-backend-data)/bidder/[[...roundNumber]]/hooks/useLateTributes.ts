"use client"

import { TributeBaseQueryClient } from "@/app/ts_types/TributeBase.client"
import type { Tribute } from "@/app/ts_types/TributeBase.types"
import { useChain } from "@cosmos-kit/react"
import { useEffect, useState } from "react"

type MapByProposal = Record<number, Tribute[]>

/**
 * Late tributes for a given requestedRoundId:
 * - same target round (t.round_id === requestedRoundId)
 * - created in a later round (t.creation_round > requestedRoundId)
 */
export function useLateTributes(
  tributeContractAddress: string,
  requestedRoundId: number,
  currentRoundId: number,
  refreshKey: number = 0
) {
  const { getCosmWasmClient } = useChain("neutron")
  const [byProposal, setByProposal] = useState<MapByProposal>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true
    async function run() {
      try {
        setLoading(true)
        setError(null)

        if (currentRoundId <= requestedRoundId) {
          if (mounted) setByProposal({})
          return
        }

        const cw = await getCosmWasmClient()
        const qc = new TributeBaseQueryClient(cw, tributeContractAddress)

        const LIMIT = 1000
        const res = await qc.roundTributes({
          roundId: requestedRoundId,
          limit: LIMIT,
          startFrom: 0,
        })
        const tribs = res?.tributes ?? []

        const late = tribs.filter(
          (t) => Number(t.creation_round) > requestedRoundId
        )

        const grouped: MapByProposal = {}
        for (const t of late) {
          const pid = Number(t.proposal_id)
          if (!grouped[pid]) grouped[pid] = []
          if (!grouped[pid].some((x) => x.tribute_id === t.tribute_id)) {
            grouped[pid].push(t)
          }
        }

        if (mounted) setByProposal(grouped)
      } catch (e: any) {
        console.error("[useLateTributes] error:", e)
        if (mounted) setError(e)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    run()
    return () => {
      mounted = false
    }
  }, [tributeContractAddress, requestedRoundId, currentRoundId, getCosmWasmClient, refreshKey])

  return { lateByProposal: byProposal, loading, error }
}
