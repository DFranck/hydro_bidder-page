import buildExternalData from "../../../functions/scheduled-build-external-data"
import buildHydroMetaData from "../../../functions/scheduled-build-hydro-meta-data"
import buildHydroRoundData from "../../../functions/scheduled-build-hydro-round-data-in-background"
import buildHydroListingsData from "../../../functions/scheduled-build-hydro-listings"
import buildHydroLockupsData from "../../../functions/scheduled-build-hydro-lockups"

export async function GET() {
  try {
    await Promise.all([
      buildExternalData(),
      buildHydroMetaData(),
      buildHydroRoundData(),
      buildHydroListingsData(),
      buildHydroLockupsData(),
    ])

    return new Response("External data built and saved")
  } catch (error) {
    console.error("Error building external data:", error)
    return new Response("Error building external data", { status: 500 })
  }
}
