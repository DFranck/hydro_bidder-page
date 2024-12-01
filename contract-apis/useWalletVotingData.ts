"use client"

import { useQuery } from "@tanstack/react-query"
import { defaultStaleTime } from "./_globals"
import { fetchWalletVotingData } from "./fetchWalletVotingData"

export const useWalletVotingData = (address?: string) => {
  return useQuery({
    queryKey: ["walletVotingData", address],
    queryFn: () => fetchWalletVotingData(address),
    staleTime: defaultStaleTime,
  })
}
