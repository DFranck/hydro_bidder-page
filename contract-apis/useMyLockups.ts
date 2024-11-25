"use server"

import { useQuery } from "@tanstack/react-query"
import { defaultStaleTime } from "./_globals"
import { fetchMyAllLockups } from "./fetchMyAllLockups"

export const useMyLockups = (address: string) => {
  return useQuery({
    queryKey: ["myLockups", address],
    queryFn: () => fetchMyAllLockups(address),
    staleTime: defaultStaleTime,
  })
}
