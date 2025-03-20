import { getEnvironmentVariable } from "@/contract-apis/getEnvironmentVariable"
import "@netlify/functions"

interface PriceDetails {
  token_symbol: string
  token_exponent: number
  token_price: number
}

interface RoundPrices {
  [key: string]: PriceDetails
}

export async function fetchRoundPrices({
  roundId,
}: {
  roundId: number
}): Promise<RoundPrices> {
  const numiaPricesEndpoint = getEnvironmentVariable("NUMIA_PRICES_ENDPOINT")
  const numiaCosmosHydroAppApiKey = getEnvironmentVariable(
    "NUMIA_COSMOS_HYDRO_APP_API_KEY"
  )

  const response = await fetch(`${numiaPricesEndpoint}?round_id=${roundId}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${numiaCosmosHydroAppApiKey}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch numia price data: ${response.statusText}`)
  }

  // Clean up the response
  const responseJson = await response.json()
  const prices = JSON.parse(responseJson[0].response).data

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
