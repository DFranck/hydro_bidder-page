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

  if (process.env.NEXT_PUBLIC_SHOW_HIDDEN_FEATURES === "true") {
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
  // redirecting /lock-atom -> /bids
  if (pathname.startsWith("/lock-atom")) {
    return NextResponse.redirect(new URL("/bids", request.url))
  }

  return NextResponse.next()
}
