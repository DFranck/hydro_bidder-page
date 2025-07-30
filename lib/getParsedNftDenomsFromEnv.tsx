export function getParsedNftDenomsFromEnv(): string[] {
  try {
    const raw = process.env.NEXT_PUBLIC_ALLOWED_NFT_DENOMS
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}
