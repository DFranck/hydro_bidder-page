"use client"

import { Tribute } from "@/app/ts_types/TributeBase.types"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
// 1 month in nanoseconds
export const lockEpochLength = 2628000000000000

export enum LockupPeriod {
  ONE_EPOCH = "1m",
  // TWO_EPOCHS = "2m",
  // THREE_EPOCHS = "3m",
  // SIX_EPOCHS = "6m",
  // TWELVE_EPOCHS = "12m",
}

export enum LockupPeriodMultipler {
  "1m" = 1,
  "2m" = 2,
  "3m" = 3,
  // "6m" = 6,
  // "12m" = 12,
}

export function getLockupTimeNanoseconds(lockupPeriod: LockupPeriod) {
  return lockEpochLength * LockupPeriodMultipler[lockupPeriod]
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateTimeRemaining(lockEnd: string) {
  const now = new Date().getTime()
  const end = parseInt(lockEnd) / 1000000 // Convert nanoseconds to milliseconds
  const diff = Math.max(0, end - now) // Ensure non-negative difference

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)

  if (hours < 1) {
    return "< 1 hour"
  } else if (days < 1) {
    return `${hours} hour${hours !== 1 ? "s" : ""}`
  } else {
    return `${days} day${days !== 1 ? "s" : ""}`
  }
}

// Scale lockup power
// 1x if lockup is between 0 and 1 epochs
// 1.5x if lockup is between 1 and 3 epochs
// 2x if lockup is between 3 and 6 epochs
// 4x if lockup is between 6 and 12 epochs
export function calculateLockupVotingPower(
  amount: number,
  lockupPeriod: LockupPeriod
) {
  switch (lockupPeriod) {
    case LockupPeriod.ONE_EPOCH:
      return amount
    // case LockupPeriod.TWO_EPOCHS:
    //     return amount * 1.25
    // case LockupPeriod.THREE_EPOCHS:
    //     return amount * 1.5
    // case LockupPeriod.SIX_EPOCHS:
    //     return amount * 2
    // case LockupPeriod.TWELVE_EPOCHS:
    //     return amount * 4
    default:
      return amount
  }
}

export function formatAmount(
  amount: string | number | bigint,
  decimals: number = 6,
  digits: number = 4
) {
  amount = Number(amount) / 10 ** decimals
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    trailingZeroDisplay: "stripIfInteger",
  })
}

export function formatDenom(denom: string, symbol: string | undefined) {
  return symbol || (denom.length > 20 ? denom.slice(0, 17) + "..." : denom)
}

// Ported from cosmwasm contract
export function scaleLockupPower(lockupTime: number, rawPower: bigint): bigint {
  const two = BigInt(2)

  // Scale lockup power
  // 1x if lockup is between 0 and 1 epochs
  // 1.25x if lockup is between 1 and 2 epochs
  // 1.5x if lockup is between 2 and 3 epochs
  // 2x if lockup is between 3 and 6 epochs
  // 4x if lockup is between 6 and 12 epochs
  if (lockupTime > lockEpochLength * 6) {
    // 4x if lockup is over 6 epochs
    return rawPower * two * two
  } else if (lockupTime > lockEpochLength * 3) {
    // 2x if lockup is between 3 and 6 epochs
    return rawPower * two
  } else if (lockupTime > lockEpochLength * 2) {
    // 1.5x if lockup is between 2 and 3 epochs
    return rawPower + rawPower / two
  } else if (lockupTime > lockEpochLength) {
    // 1.25x if lockup is between 1 and 2 epochs
    return rawPower + rawPower / (two * two)
  } else {
    // Covers 0 and 1 epoch which have no scaling
    return rawPower
  }
}

// Calculates and formats the total tribute amounts for each token in a list of tributes.
//
// This function takes an array of Tribute objects and processes them to:
// 1. Sum up the amounts for each unique token (denom).
// 2. Preserve the order in which tokens first appear.
// 3. Return an array of objects, each containing a token and its total amount.
//
// The returned array maintains the original order of token appearance and
// provides a clear summary of total tributes per token type.
export function sumTributeAmounts(
  tributes: Tribute[]
): { denom: string; amount: number }[] {
  // Sum up tributes by denom, maintaining order of first appearance
  const denomSums = new Map<string, number>()
  const denomOrder: string[] = []

  tributes.forEach((tribute) => {
    const { denom, amount } = tribute.funds
    if (!denomSums.has(denom)) {
      denomSums.set(denom, 0)
      denomOrder.push(denom)
    }
    denomSums.set(denom, denomSums.get(denom)! + parseInt(amount))
  })

  return denomOrder.map((denom) => ({
    denom,
    amount: denomSums.get(denom)!,
  }))
}

// APR Calc: your_est_reward / price(your_atom) * 12
// Non-user specific APR: 1_uatom_est_reward_at_specific_lock_time / price(1_uatom) * 12 (put a range?)
// 1 top line APR calc: sum(Max(non_user_apr)) + staking APR
export function estimatedRewardForPower(
  proposalTotalTribute: number,
  myVotingPower: number,
  proposalPower: number
) {
  if (proposalPower === 0) {
    return proposalTotalTribute
  }

  return (
    proposalTotalTribute * (myVotingPower / (proposalPower + myVotingPower))
  )
}

export function userSpecificAPR(
  proposalTotalTribute: number,
  myVotingPower: number,
  proposalPower: number,
  myLockedAtom: number
) {
  return (
    (estimatedRewardForPower(
      proposalTotalTribute,
      myVotingPower,
      proposalPower
    ) /
      myLockedAtom) *
    12
  )
}

export function nonUserSpecificAPR(
  proposalTotalTribute: number,
  proposalPower: number,
  lockupPeriod: LockupPeriod,
  atomPrice: number
) {
  // Get the power of 1 uatom locked for the specified time
  const oneUatomPower = scaleLockupPower(
    getLockupTimeNanoseconds(lockupPeriod),
    BigInt(1)
  )

  const oneUatomReward = estimatedRewardForPower(
    proposalTotalTribute,
    Number(oneUatomPower),
    proposalPower
  )

  const oneUatomPrice = atomPrice / 1e6

  return (oneUatomReward / oneUatomPrice) * 12
}

export function topLineAPR(
  proposalAPRinputs: Map<
    number,
    {
      proposalTotalTribute: number
      proposalPower: number
    }[]
  >,
  lockupPeriod: LockupPeriod,
  atomPrice: number,
  stakingAPR: number
) {
  // Calculate the maximum APR
  const maxAPR = Array.from(proposalAPRinputs, ([_, value]) => value).reduce(
    (acc, trancheAPRinputs) => {
      // Calculate APR for each proposal in the current tranche
      const proposalAPRs = trancheAPRinputs.map((input) =>
        nonUserSpecificAPR(
          input.proposalTotalTribute,
          input.proposalPower,
          lockupPeriod,
          atomPrice
        )
      )

      // Add the maximum APR from this tranche to the accumulator
      return acc + Math.max(...proposalAPRs)
    },
    0
  )

  return maxAPR + stakingAPR
}
