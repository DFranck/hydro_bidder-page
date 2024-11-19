"use client"

import { useQuery } from "@tanstack/react-query"
import { defaultStaleTime } from "./_globals"
import { fetchProposals } from "./fetchProposals"

export const useProposals = (roundId: number, trancheId: number) => {
  return useQuery({
    queryKey: ["proposals", roundId, trancheId],
    queryFn: () => fetchProposals(roundId, trancheId),
    staleTime: defaultStaleTime,
  })
}
