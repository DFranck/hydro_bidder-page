"use client"

import { ChainContext } from "@cosmos-kit/core"
import { useQuery } from "@tanstack/react-query"
import { fetchMyValidators } from "./fetchWalletValidators"

export function useWalletValidators(
  chain: ChainContext,
  delegatorAddress: string
) {
  return useQuery({
    queryKey: ["myValidators", delegatorAddress],
    queryFn: () => fetchMyValidators(chain, delegatorAddress),
    staleTime: 10000,
  })
}
