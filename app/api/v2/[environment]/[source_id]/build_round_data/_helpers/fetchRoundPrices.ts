import { RoundPrices } from "@/contract-apis/types"

export async function fetchRoundPrices({
  chainId,
  roundId,
  cacheDuration = 300,
}: {
  chainId: string
  roundId: number
  cacheDuration?: number
}): Promise<RoundPrices> {
  const url = new URL("/hydro/v2/round_prices", "https://cosmos.numia.xyz")
  url.searchParams.append("chain_id", chainId)
  url.searchParams.append("round_id", roundId.toString())

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${process.env.NUMIA_COSMOS_HYDRO_APP_API_KEY}`,
    },
    next: { revalidate: cacheDuration },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch numia price data: ${response.statusText}`)
  }

  // Clean up the response
  const prices = await response.json()

  const roundPrices = prices.reduce((acc: any, price: any) => {
    acc[price.token_denom] = {
      token_symbol: price.token_symbol,
      token_exponent: price.token_exponent,
      token_price: price.token_price,
    }
    return acc
  }, {})
  return roundPrices as RoundPrices
}
