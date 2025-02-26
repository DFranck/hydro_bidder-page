export function isDeepEqual<T>(a: T, b: T, visited = new WeakMap()): boolean {
  if (a === b) return true

  if (typeof a !== "object" || typeof b !== "object" || !a || !b) {
    return false
  }

  if (visited.has(a as object)) {
    return visited.get(a as object) === b
  }
  visited.set(a as object, b)

  const keysA = Object.keys(a as object)
  const keysB = Object.keys(b as object)

  if (keysA.length !== keysB.length) {
    return false
  }

  return keysA.every((key) => {
    return isDeepEqual((a as any)[key], (b as any)[key], visited)
  })
}
