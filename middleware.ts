import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host")
  const pathname = request.nextUrl.pathname

  // redirecting /voting -> /bids
  if (pathname.startsWith("/voting")) {
    const response = NextResponse.redirect(
      new URL(pathname.replace("/voting", "/bids"), request.url)
    )
    return response
  }

  // Redirects below in development environment are not neede
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next()
  }

  // TODO: remove this hardcoded redirect
  // redirecting /rewards -> /
  if (pathname.startsWith("/rewards")) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // TODO: remove this hardcoded redirect
  // redirecting /metrics -> /
  if (pathname.startsWith("/metrics")) {
    return NextResponse.redirect(new URL("/", request.url))
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
