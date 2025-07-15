import { fetchTotalLockedTokens } from "@/contract-apis/fetchTotalLockedTokens"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetchTotalLockedTokens()

    return NextResponse.json({
      rawTotalLockedTokens: response.totalLockedTokens,
      rawLockedAtomMaxGlobal: response.lockedAtomMaxGlobal,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error("Error in API route:", error)
    return NextResponse.json(
      { error: "Failed to fetch total locked tokens" },
      { status: 500 }
    )
  }
}
