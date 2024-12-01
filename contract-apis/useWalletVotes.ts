"use client"

import { useQuery } from "@tanstack/react-query"
import { defaultStaleTime } from "./_globals"
import { fetchWalletVotes } from "./fetchWalletVotes"

export function useWalletVotes(
  address: string,
  roundId: number,
  trancheIds: number[]
) {
  return useQuery({
    queryKey: ["myVotes", address, roundId, trancheIds],
    queryFn: () => fetchWalletVotes(address, roundId, trancheIds),
    staleTime: defaultStaleTime,
  })
}
