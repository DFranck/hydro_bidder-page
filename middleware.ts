import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/UserVotingData")) {
    return NextResponse.redirect(
      new URL(request.nextUrl.pathname.replace("/voting", "/bids"), request.url)
    )
  }

  // TODO: remove this hardcoded redirect
  if (request.nextUrl.pathname === "/lock-atom") {
    return NextResponse.redirect(new URL("/bids", request.url))
  }
  return NextResponse.next()
}
