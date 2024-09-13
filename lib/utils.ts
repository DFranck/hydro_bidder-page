import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

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
