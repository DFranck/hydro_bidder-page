"use client"

import { useQuery } from "@tanstack/react-query"
import { defaultStaleTime } from "./_globals"
import { fetchWalletLockups } from "./fetchWalletLockups"

export function useWalletLockups(address: string) {
  return useQuery({
    queryKey: ["myLockups", address],
    queryFn: () => fetchWalletLockups(address),
    staleTime: defaultStaleTime,
  })
}
