import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Tribute } from "@/app/ts_types/TributeBase.types"
import { NEUTRON_ASSETS } from "@/config"
// 1 month in nanoseconds
export const lockEpochLength = 2628000000000000

export enum LockupPeriod {
    ONE_EPOCH = "1m",
    TWO_EPOCHS = "2m",
    THREE_EPOCHS = "3m",
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

export const timeRemainingPercent = (start: string, end: string) => {
    const startMilis = parseInt(start) / 1e6
    const endMilis = parseInt(end) / 1e6
    const nowMs = Date.now()
    const totalDuration = endMilis - startMilis
    const elapsedTime = nowMs - startMilis
    const percentagePassed = (elapsedTime / totalDuration) * 100

    return Math.floor(percentagePassed)
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
        case LockupPeriod.TWO_EPOCHS:
            return amount * 1.25
        case LockupPeriod.THREE_EPOCHS:
            return amount * 1.5
        // case LockupPeriod.SIX_EPOCHS:
        //     return amount * 2
        // case LockupPeriod.TWELVE_EPOCHS:
        //     return amount * 4
        default:
            return amount
    }
}

export function formatAmount(amount: string | number | bigint) {
    amount = Number(amount) / 1000000
    return amount.toLocaleString("en-US", {
        minimumFractionDigits: 6,
        trailingZeroDisplay: "stripIfInteger",
    })
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

export function displayNeutronDenom(base: string): string {
    return (
        NEUTRON_ASSETS.assets.find(
            (asset) => asset.base.toLowerCase() === base.toLowerCase()
        )?.symbol ?? base
    )
}
