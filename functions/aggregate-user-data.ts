import { Handler } from "@netlify/functions"
import fs from "fs"
import path from "path"
import { HydroBaseQueryClient } from "../app/ts_types/HydroBase.client"
import { LockupWithPerTrancheInfo } from "../app/ts_types/HydroBase.types"
import { getCosmWasmClient } from "../contract-apis/getCosmWasmClient"
import { fetchHistoricUsers } from "../contract-apis/mergedFetchers/fetchHistoricUsers"

interface AggregatedData {
  timestamp: number
  users: string[]
  lockups: {
    [address: string]: LockupWithPerTrancheInfo[]
  }
}

const handler: Handler = async () => {
  try {
    // Fetch all users
    const { users } = await fetchHistoricUsers()

    // Initialize Hydro client
    const client = await getCosmWasmClient()
    const hydroQueryClient = new HydroBaseQueryClient(
      client,
      process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS!
    )

    // Fetch lockups for all users in parallel batches
    const batchSize = 50 // Adjust based on rate limits
    const lockups: { [address: string]: LockupWithPerTrancheInfo[] } = {}

    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize)
      const batchResults = await Promise.all(
        batch.map(async (address) => {
          const query = {
            address,
            limit: 1000,
            startFrom: 0,
          }
          const { lockups_with_per_tranche_infos } =
            await hydroQueryClient.allUserLockupsWithTrancheInfos(query)
          return { address, lockups: lockups_with_per_tranche_infos }
        })
      )

      batchResults.forEach(({ address, lockups: userLockups }) => {
        lockups[address] = userLockups
      })
    }

    // Aggregate data
    const aggregatedData: AggregatedData = {
      timestamp: Date.now(),
      users,
      lockups,
    }

    // Write to JSON file
    const outputPath = path.join(
      process.cwd(),
      "public",
      "data",
      "user-lockups.json"
    )
    fs.mkdirSync(path.dirname(outputPath), { recursive: true })
    fs.writeFileSync(outputPath, JSON.stringify(aggregatedData, null, 2))

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Successfully aggregated user data",
        timestamp: aggregatedData.timestamp,
      }),
    }
  } catch (error) {
    console.error("Error aggregating user data:", error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to aggregate user data" }),
    }
  }
}

export { handler }
