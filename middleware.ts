import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // redirecting /voting -> /bids
  if (pathname.startsWith("/voting")) {
    const response = NextResponse.redirect(
      new URL(pathname.replace("/voting", "/bids"), request.url)
    )
    return response
  }

  // Redirects below only work in production environments
  if (process.env.CONTEXT !== "production") {
    return NextResponse.next()
  }

  // TODO: remove this hardcoded redirect
  // redirecting /airdrops -> /
  if (pathname.startsWith("/airdrops")) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // TODO: remove this hardcoded redirect
  // redirecting /lock-atom -> /bids
  if (pathname.startsWith("/lock-atom")) {
    return NextResponse.redirect(new URL("/bids", request.url))
  }

  return NextResponse.next()
}
