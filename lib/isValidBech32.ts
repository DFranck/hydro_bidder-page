import { normalizeBech32 } from "@cosmjs/encoding"
export const isValidBech32 = (address: string, prefix: string): boolean => {
  if (!address.startsWith(prefix)) {
    return false
  }

  try {
    normalizeBech32(address)
    return true
  } catch {
    return false
  }
}
