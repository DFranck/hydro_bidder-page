import { getEnvironmentVariable } from "@/contract-apis/getEnvironmentVariable"
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

  if (getEnvironmentVariable("NEXT_PUBLIC_SHOW_HIDDEN_FEATURES") === "true") {
    return NextResponse.next({
      request: { headers: requestHeaders },
    })
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}
