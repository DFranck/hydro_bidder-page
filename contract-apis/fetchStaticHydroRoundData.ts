import { RawStaticHydroRoundData } from "@/contract-apis/types"

export async function fetchStaticHydroRoundData(): Promise<RawStaticHydroRoundData> {
  const hydroRoundData = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/data/raw-hydro-round-data.json`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )

  if (!hydroRoundData.ok) {
    throw new Error("Failed to fetch static hydro round data")
  }

  return hydroRoundData.json()
}
