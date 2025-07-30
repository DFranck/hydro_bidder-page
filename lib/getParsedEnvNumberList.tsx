export function getParsedEnvNumberList(key: string): number[] {
  try {
    const raw = process.env[key]
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
