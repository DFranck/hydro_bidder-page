import { getEnvironmentVariable } from "@/contract-apis/getEnvironmentVariable"
import "@netlify/functions"

export async function fetchHistoricUsers(): Promise<{ users: string[] }> {
  const numiaUsersEndpoint = getEnvironmentVariable("NUMIA_USERS_ENDPOINT")
  const numiaCosmosHydroAppApiKey = getEnvironmentVariable(
    "NUMIA_COSMOS_HYDRO_APP_API_KEY"
  )

  const response = await fetch(`${numiaUsersEndpoint}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${numiaCosmosHydroAppApiKey}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch numia users data: ${response.statusText}`)
  }

  // Clean up the response
  const responseJson = await response.json()
  const users = responseJson[0]
  return users
}
