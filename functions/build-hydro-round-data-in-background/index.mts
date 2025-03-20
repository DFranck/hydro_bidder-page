import { Context } from "@netlify/functions"
import fs from "fs"
import path from "path"
import { RawStaticHydroRoundData } from "../../contract-apis/types"
import { fetchHydroRoundsData } from "./_fetchers/fetchHydroRoundsData"

export default async (req: Request, context: Context) => {
  context.log("Background function started")
  try {
    context.log("Starting data fetch...")

    const hydroRoundData = await fetchHydroRoundsData()

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
