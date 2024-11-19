"use client"

import { useQuery } from "@tanstack/react-query"
import { defaultStaleTime } from "./_globals"
import { fetchRoundState } from "./fetchRoundState"

export const useRoundState = (roundId: number) => {
  return useQuery({
    queryKey: ["roundState", roundId],
    queryFn: () => fetchRoundState(roundId),
    staleTime: defaultStaleTime,
  })
}
