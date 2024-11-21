const nonBreakingSpaceCharacter = String.fromCharCode(160)

export function amountToUSDString(
  amount: number,
  numberOfDecimals: number = 2
) {
  return [
    amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: numberOfDecimals,
      maximumFractionDigits: numberOfDecimals,
    }),
    "USD",
  ].join(nonBreakingSpaceCharacter)
}
