export function formatAmount(
  amount: string | number | bigint,
  decimals: number = 6,
  digits: number = 4
) {
  amount = Number(amount) / 10 ** decimals
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    trailingZeroDisplay: "stripIfInteger",
  })
}
