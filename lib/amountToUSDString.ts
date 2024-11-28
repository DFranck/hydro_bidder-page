const nonBreakingSpaceCharacter = String.fromCharCode(160)

export function amountToUSDString(
  amount: number,
  numberOfDecimals: number = 2
) {
  const amountToPrint = Number(amount ?? 0)
  return [
    amountToPrint > 0 ? "≈" : null,
    amountToPrint.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: numberOfDecimals,
      maximumFractionDigits: numberOfDecimals,
    }),
    "USD",
  ]
    .filter(Boolean)
    .join(nonBreakingSpaceCharacter)
}
