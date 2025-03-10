import { RawStaticExternalData } from "@/contract-apis/types"

export async function fetchStaticExternalData(): Promise<RawStaticExternalData> {
  const staticExternalData = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/data/raw-external-data.json`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )

  if (!staticExternalData.ok) {
    throw new Error("Failed to fetch static external data")
  }

  return staticExternalData.json()
}
