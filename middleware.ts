import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname ?? ""

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

  return NextResponse.next()
}
