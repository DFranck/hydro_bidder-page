import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  // redirecting /voting -> /bids
  if (request.nextUrl.pathname.startsWith("/voting")) {
    return NextResponse.redirect(
      new URL(request.nextUrl.pathname.replace("/voting", "/bids"), request.url)
    )
  }

  if (process.env.CONTEXT !== "production") {
    return NextResponse.next()
  }

  // TODO: remove this hardcoded redirect
  // redirecting /airdrops -> /
  if (request.nextUrl.pathname.startsWith("/airdrops")) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // TODO: remove this hardcoded redirect
  // redirecting /lock-atom -> /bids
  if (request.nextUrl.pathname.startsWith("/lock-atom")) {
    return NextResponse.redirect(new URL("/bids", request.url))
  }
  return NextResponse.next()
}
