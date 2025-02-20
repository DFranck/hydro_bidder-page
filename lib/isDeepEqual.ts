export function isDeepEqual<T>(a: T, b: T): boolean {
  if (a === b) return true

  if (typeof a !== "object" || typeof b !== "object" || !a || !b) {
    return false
  }

  const keysA = Object.keys(a as object)
  const keysB = Object.keys(b as object)

  if (keysA.length !== keysB.length) {
    return false
  }

  return keysA.every((key) => {
    return isDeepEqual((a as any)[key], (b as any)[key])
  })
}
