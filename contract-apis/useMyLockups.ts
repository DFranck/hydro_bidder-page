"use client"

import { useQuery } from "@tanstack/react-query"
import { defaultStaleTime } from "./_globals"
import { fetchMyAllLockups } from "./fetchMyAllLockups"

export function useMyLockups(address: string) {
  return useQuery({
    queryKey: ["myLockups", address],
    queryFn: () => fetchMyAllLockups(address),
    staleTime: defaultStaleTime,
  })
}
