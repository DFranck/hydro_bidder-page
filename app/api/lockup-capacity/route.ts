import { fetchGlobalLockupCapacity } from "@/contract-apis/fetchGlobalLockupCapacity"
import { NextResponse } from "next/server"

export async function GET() {
  const globalLockupCapacity = await fetchGlobalLockupCapacity()

  return NextResponse.json(globalLockupCapacity)
}
