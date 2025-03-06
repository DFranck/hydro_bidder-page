export function mergeWithOverwrite(target: any, ...sources: any[]) {
  sources.forEach((source) => {
    Object.keys(source).forEach((key) => {
      if (key.startsWith("$")) {
        // Overwrite rule: remove '$' prefix and assign source value
        const realKey = key.slice(1)
        const srcVal = source[key]
        // Handle Date objects explicitly
        if (srcVal instanceof Date) {
          target[realKey] = new Date(srcVal.getTime())
        } else {
          target[realKey] = srcVal
        }
      } else {
        const srcVal = source[key]
        const tgtVal = target[key]

        // Handle Date objects explicitly
        if (srcVal instanceof Date) {
          target[key] = new Date(srcVal.getTime())
        }
        // Merge arrays by concatenation
        else if (Array.isArray(srcVal)) {
          if (!Array.isArray(tgtVal)) {
            target[key] = []
          }
          target[key] = target[key].concat(srcVal)
        }
        // Recursively merge objects (and treat Dates properly as above)
        else if (srcVal && typeof srcVal === "object") {
          if (!tgtVal || typeof tgtVal !== "object" || Array.isArray(tgtVal)) {
            target[key] = {}
          }
          mergeWithOverwrite(target[key], srcVal)
        }
        // For primitives, simply assign
        else {
          target[key] = srcVal
        }
      }
    })
  })
  return target
}
