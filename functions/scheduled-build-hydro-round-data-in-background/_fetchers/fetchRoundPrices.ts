import { invariant } from "ts-invariant"
import { RoundPrices } from "../../../contract-apis/types"
import { fetchWithRetry } from "@/contract-apis/fetchWithRetry"

export async function fetchRoundPrices({
  roundId,
}: {
  roundId: number
}): Promise<RoundPrices> {
  const chainId = "neutron-1" // TODO: this should likely be in an env var

  const numiaPricesEndpoint = process.env.NUMIA_PRICES_ENDPOINT

  const numiaCosmosHydroAppApiKey = process.env.NUMIA_COSMOS_HYDRO_APP_API_KEY

  invariant(numiaPricesEndpoint, "NUMIA_PRICES_ENDPOINT is not set")

  invariant(
    numiaCosmosHydroAppApiKey,
    "NUMIA_COSMOS_HYDRO_APP_API_KEY is not set"
  )

  try {
    const response = await fetchWithRetry(
      `${numiaPricesEndpoint}?round_id=${roundId}&time=${new Date().getTime()}&chain_id=neutron-1`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${numiaCosmosHydroAppApiKey}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(
        `Failed to fetch numia round prices data: ${response.statusText}`
      )
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
  } catch (error) {
    throw new Error(`Error fetching round prices: ${error}`)
  }
}
