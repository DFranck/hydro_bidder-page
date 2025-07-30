export function getParsedEnvList(key: string): string[] {
  try {
    const raw = process.env[key]
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}
