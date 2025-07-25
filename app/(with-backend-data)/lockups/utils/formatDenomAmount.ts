export function formatDenomAmount(amount: string, exponent: number): string {
  return (Number(amount) / Math.pow(10, exponent)).toString()
}
