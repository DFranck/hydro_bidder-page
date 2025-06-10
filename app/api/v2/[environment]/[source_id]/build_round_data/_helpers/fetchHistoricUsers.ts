export async function fetchHistoricUsers({
  hydroContract,
}: {
  hydroContract: string
}): Promise<{ users: string[] }> {
  const url = new URL("/hydro/v2/historic_users", "https://cosmos.numia.xyz")
  url.searchParams.append("hydro_contract", hydroContract)

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${process.env.NUMIA_COSMOS_HYDRO_APP_API_KEY}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch numia users data: ${response.statusText}`)
  }

  // Clean up the response
  const responseJson = await response.json()
  const users = responseJson[0] ?? []
  return users
}
