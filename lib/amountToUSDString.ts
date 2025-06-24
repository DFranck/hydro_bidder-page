const nonBreakingSpaceCharacter = String.fromCharCode(160)

interface AmountToUSDStringOptions {
  appendUsd: boolean
  numberOfDecimals: number
  removeTrailingZeros: boolean
}

export function amountToUSDString(
  amount: number,
  options: AmountToUSDStringOptions = {
    appendUsd: true,
    numberOfDecimals: 2,
    removeTrailingZeros: true,
  }
) {
  const { appendUsd, numberOfDecimals, removeTrailingZeros } = options
  const amountToPrint = Number(amount ?? 0)
  const formattedAmount = amountToPrint.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: numberOfDecimals,
    maximumFractionDigits: numberOfDecimals,
  })
  const amountWithoutTrailingZeros = removeTrailingZeros
    ? formattedAmount.replace(/\.0+$/, "")
    : formattedAmount
  const amountWithUsd =
    appendUsd && amountToPrint > 0
      ? [amountWithoutTrailingZeros, "USD"]
      : [amountWithoutTrailingZeros]

  return amountWithUsd.join(nonBreakingSpaceCharacter)
}

export function formatAmountToUsd(amount: number, price: number): number {
  const printableAmount = Number(amount) * price

  return printableAmount
}
