import { isTouchscreen } from "@/lib/isTouchscreen"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  const pathname = request.nextUrl.pathname ?? ""

  // So we can get it from any request
  requestHeaders.set("x-url", request.url)

  // redirecting /voting -> /bids
  if (pathname.startsWith("/voting")) {
    const response = NextResponse.redirect(
      new URL(pathname.replace("/voting", "/bids"), request.url)
    )
    return response
  }

  // redirecting touchscreen devices from /bids to /v2
  if (pathname === "/bids" || pathname === "/bids/") {
    const userAgent = request.headers.get("user-agent") || ""

    if (isTouchscreen(userAgent)) {
      const response = NextResponse.redirect(
        new URL(pathname.replace("/bids", "/v2"), request.url)
      )
      return response
    }
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}
