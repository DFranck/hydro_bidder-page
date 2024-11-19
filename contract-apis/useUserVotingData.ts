"use client"

import { useQuery } from "@tanstack/react-query"
import { defaultStaleTime } from "./_globals"
import { fetchUserVotingData } from "./fetchUserVotingData"

export const useUserVotingData = (address?: string) => {
  return useQuery({
    queryKey: ["userVotingData", address],
    queryFn: () => fetchUserVotingData(address),
    staleTime: defaultStaleTime,
  })
}
