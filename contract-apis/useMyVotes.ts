"use client"

import { useQuery } from "@tanstack/react-query"
import { defaultStaleTime } from "./_globals"
import { fetchMyVotes } from "./fetchMyVotes"

export const useMyVotes = (
  myAddress: string,
  roundId: number,
  trancheIds: number[]
) => {
  return useQuery({
    queryKey: ["myVotes", myAddress, roundId, trancheIds],
    queryFn: () => fetchMyVotes(myAddress, roundId, trancheIds),
    staleTime: defaultStaleTime,
  })
}
