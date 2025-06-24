import { fetchTotalLockedTokens } from "@/contract-apis/fetchTotalLockedTokens"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetchTotalLockedTokens()
    return NextResponse.json({
      rawTotalLockedTokens: response.totalLockedTokens,
      rawLockedAtomMaxGlobal: response.lockedAtomMaxGlobal,
    })
  } catch (error) {
    console.error("Error in API route:", error)
    return NextResponse.json(
      { error: "Failed to fetch total locked tokens" },
      { status: 500 }
    )
  }
}
