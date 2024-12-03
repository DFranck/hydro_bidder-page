import { Tribute } from "@/app/ts_types/TributeBase.types"

// Calculates and formats the total tribute amounts for each token in a list of tributes.
//
// This function takes an array of Tribute objects and processes them to:
// 1. Sum up the amounts for each unique token (denom).
// 2. Preserve the order in which tokens first appear.
// 3. Return an array of objects, each containing a token and its total amount.
//
// The returned array maintains the original order of token appearance and
// provides a clear summary of total tributes per token type.

export function sumTributeAmounts(
  tributes: Tribute[]
): { denom: string; amount: number }[] {
  // Sum up tributes by denom, maintaining order of first appearance
  const denomSums = new Map<string, number>()
  const denomOrder: string[] = []

  tributes.forEach((tribute) => {
    const { denom, amount } = tribute.funds
    if (!denomSums.has(denom)) {
      denomSums.set(denom, 0)
      denomOrder.push(denom)
    }
    denomSums.set(denom, denomSums.get(denom)! + parseInt(amount))
  })

  return denomOrder.map((denom) => ({
    denom,
    amount: denomSums.get(denom)!,
  }))
}
