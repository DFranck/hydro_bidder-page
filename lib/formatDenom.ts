export function formatDenom(denom: string, symbol: string | undefined) {
  return symbol || (denom.length > 20 ? denom.slice(0, 17) + "..." : denom)
}
