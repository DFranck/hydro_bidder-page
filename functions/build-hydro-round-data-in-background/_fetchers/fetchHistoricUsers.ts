import "@netlify/functions"

export async function fetchHistoricUsers(): Promise<{ users: string[] }> {
  const numiaUsersEndpoint = Netlify.env.get("NUMIA_USERS_ENDPOINT")
  const numiaCosmosHydroAppApiKey = Netlify.env.get(
    "NUMIA_COSMOS_HYDRO_APP_API_KEY"
  )
  if (!numiaUsersEndpoint) {
    throw new Error("NUMIA_USERS_ENDPOINT not set")
  }
  if (!numiaCosmosHydroAppApiKey) {
    throw new Error("NUMIA_COSMOS_HYDRO_APP_API_KEY not set")
  }

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
