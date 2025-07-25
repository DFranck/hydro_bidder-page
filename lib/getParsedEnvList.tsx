"use client"

const ALLOWED_ENV_KEYS = {
  NEXT_PUBLIC_ALLOWED_NFT_DENOMS: process.env.NEXT_PUBLIC_ALLOWED_NFT_DENOMS,
}

export function getParsedEnvList(key: keyof typeof ALLOWED_ENV_KEYS): string[] {
  try {
    const raw = ALLOWED_ENV_KEYS[key]
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}
