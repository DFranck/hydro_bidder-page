import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { address } = await req.json()
  const url = `https://api.neutron.org/v1/accounts/${address}`
  const response = await fetch(url)
  const data = await response.json()
  return NextResponse.json(data)
}
