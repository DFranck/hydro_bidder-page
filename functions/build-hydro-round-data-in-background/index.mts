import { Context } from "@netlify/functions"
import fs from "fs"
import path from "path"
import { RawStaticHydroRoundData } from "../../contract-apis/types"
import { fetchHydroRoundsData } from "./_fetchers/fetchHydroRoundsData"

export default async (req: Request, context: Context) => {
  context.log("Background function started")
  try {
    const envVars = {
      NUMIA_USERS_ENDPOINT: Netlify.env.get("NUMIA_USERS_ENDPOINT"),
      NUMIA_COSMOS_HYDRO_APP_API_KEY: Netlify.env.get(
        "NUMIA_COSMOS_HYDRO_APP_API_KEY"
      ),
      NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS: Netlify.env.get(
        "NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS"
      ),
      NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS: Netlify.env.get(
        "NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS"
      ),
      NUMIA_BIDS_ENDPOINT: Netlify.env.get("NUMIA_BIDS_ENDPOINT"),
      NUMIA_LOCKUPS_ENDPOINT: Netlify.env.get("NUMIA_LOCKUPS_ENDPOINT"),
      NUMIA_TRIBUTES_ENDPOINT: Netlify.env.get("NUMIA_TRIBUTES_ENDPOINT"),
      URL: Netlify.env.get("URL"),
    }

    context.log("Environment variables:", envVars)

    for (const [key, value] of Object.entries(envVars)) {
      if (!value) {
        context.log(`Warning: ${key} is not set`)
      }
    }

    context.log("Starting data fetch...")

    const hydroRoundData = await fetchHydroRoundsData({
      hydroContractAddress: envVars.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS!,
      numiaCosmosHydroAppApiKey: envVars.NUMIA_COSMOS_HYDRO_APP_API_KEY!,
      numiaBidsEndpoint: envVars.NUMIA_BIDS_ENDPOINT!,
      numiaTributesEndpoint: envVars.NUMIA_TRIBUTES_ENDPOINT!,
      numiaLockupsEndpoint: envVars.NUMIA_LOCKUPS_ENDPOINT!,
      tributeContractAddress: envVars.NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS!,
    })

    context.log("Data fetch completed.")

    context.log(
      `Fetched data: ${JSON.stringify(hydroRoundData).substring(0, 100)}...`
    )

    context.log("Fetched raw hydro round data:", hydroRoundData)

    const rawStaticHydroRoundData: RawStaticHydroRoundData = {
      timestamp: Date.now(),
      hydroRoundData,
    }

    const outputPath = path.join(
      process.cwd(),
      "public",
      "data",
      "raw-hydro-round-data.json"
    )

    fs.mkdirSync(path.dirname(outputPath), { recursive: true })

    context.log(`Writing data to: ${outputPath}`)

    fs.writeFileSync(outputPath, JSON.stringify(rawStaticHydroRoundData))

    context.log("Background function completed successfully")
  } catch (error) {
    context.log(`Error: ${error.message}`)
    context.log(`Stack trace: ${error.stack}`)
    console.error("Error building hydro round data:", error)
  }
}
