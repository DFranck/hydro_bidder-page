"use client"

export function simplifyBigNumbers(num: number, decimals: number = 1): string {
  let formatted = num.toString()

  if (num >= 1000000000000) {
    formatted = `${(num / 1000000000000).toFixed(decimals)}T`
  } else if (num >= 1000000000) {
    formatted = `${(num / 1000000000).toFixed(decimals)}B`
  } else if (num >= 1000000) {
    formatted = `${(num / 1000000).toFixed(decimals)}M`
  } else if (num >= 1000) {
    formatted = `${(num / 1000).toFixed(decimals)}K`
  } else {
    formatted = num.toFixed(decimals)
  }

  return formatted.replace(/\.0+$/, "")
}
