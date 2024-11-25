"use server"

import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import { defaultLimit, defaultStartFrom } from "./_globals"
import { getCosmWasmClient } from "./getCosmWasmClient"

export type UserVotingData = {
  votingPower: number
  lockups: {
    count: number
    lockedAtom: number
    firstExpireTs: number
  }
}

export const fetchUserVotingData = async (
  address?: string
): Promise<UserVotingData> => {
  if (!process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS) {
    throw new Error("Hydro contract address not set")
  }

  const client = await getCosmWasmClient()
  const hydroQueryClient = new HydroBaseQueryClient(
    client,
    process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
  )

  let votingPower = 0
  let lockedAtom = {
    count: 0,
    lockedAtom: 0,
    firstExpireTs: 0,
  }

  if (!address) return { votingPower, lockups: lockedAtom }

  try {
    const [power, lockups] = await Promise.all([
      hydroQueryClient.userVotingPower({ address }),
      hydroQueryClient.allUserLockups({
        address,
        limit: defaultLimit,
        startFrom: defaultStartFrom,
      }),
    ])
    votingPower = power.voting_power
    lockedAtom.lockedAtom = lockups.lockups.reduce((acc, lockup) => {
      return acc + parseInt(lockup.lock_entry.funds.amount)
    }, 0)
    lockedAtom.count = lockups.lockups.length
    lockedAtom.firstExpireTs = lockups.lockups.reduce((acc, lockup) => {
      const lockEnd = parseInt(lockup.lock_entry.lock_end)
      return acc === 0 || lockEnd < acc ? lockEnd : acc
    }, 0)
  } catch (error) {
    console.error("Error fetching user voting data:", error)
  }

  return {
    votingPower,
    lockups: lockedAtom,
  }
}
