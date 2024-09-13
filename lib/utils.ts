import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export enum LockupPeriod {
    ONE_EPOCH = "1m",
    THREE_EPOCHS = "3m",
    SIX_EPOCHS = "6m",
    TWELVE_EPOCHS = "12m",
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function calculateDaysRemaining(lockEnd: string) {
    const now = new Date().getTime()
    const end = parseInt(lockEnd) / 1000000 // Convert nanoseconds to milliseconds
    const diff = end - now
    const daysRemaining = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))) // Ensure non-negative result
    console.log(
        `Lock end: ${lockEnd}, Now: ${now}, Diff: ${diff}, Days remaining: ${daysRemaining}`
    )
    return daysRemaining
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
            return amount;
        case LockupPeriod.THREE_EPOCHS:
            return amount * 1.5;
        case LockupPeriod.SIX_EPOCHS:
            return amount * 2;
        case LockupPeriod.TWELVE_EPOCHS:
            return amount * 4;
        default:
            return amount;
    }
}

export function formatAmount(amount: string) {
    return (parseInt(amount) / 1000000).toLocaleString("en-US", {
        minimumFractionDigits: 6,
    })
}
