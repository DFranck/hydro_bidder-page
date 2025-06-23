import { environments, getEnvironment } from '@v2/environments'

export async function fetchWalletData(address: string) {
  const environment = getEnvironment()
  const { sources } = environments[environment]

  return Promise.all(
    sources.map(async (source) => {
      const urlPrefix = `/api/v2/${environment}/${source.id}`

      // Fetch wallet data for this source
      let walletData = null
      try {
        const walletDataResponse = await fetch(
          `${urlPrefix}/wallet_data?address=${address}`
        )
        if (walletDataResponse.ok) {
          walletData = await walletDataResponse.json()
        }
      } catch (error) {
        console.error('Failed to fetch wallet data:', error)
      }

      return {
        sourceId: source.id,
        walletData,
      }
    })
  )
}
