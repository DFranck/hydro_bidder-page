"use client"

export function getParsedNftSizesFromEnv(): number[] {
  try {
    const raw = process.env.NEXT_PUBLIC_NFT_SIZES
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) &&
      parsed.every((item) => typeof item === "number")
      ? parsed
      : []
  } catch {
    return []
  }
}
