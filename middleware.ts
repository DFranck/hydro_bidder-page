import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // redirecting /voting -> /bids
  if (pathname.startsWith("/voting")) {
    const response = NextResponse.redirect(
      new URL(pathname.replace("/voting", "/bids"), request.url)
    )
    response.headers.set("x-pathname", pathname)
    return response
  }

  // Redirects below only work in production environments
  if (process.env.CONTEXT !== "production") {
    const response = NextResponse.next()
    response.headers.set("x-pathname", pathname)
    return response
  }

  // TODO: remove this hardcoded redirect
  // redirecting /airdrops -> /
  if (pathname.startsWith("/airdrops")) {
    const response = NextResponse.redirect(new URL("/", request.url))
    response.headers.set("x-pathname", pathname)
    return response
  }

  // TODO: remove this hardcoded redirect
  // redirecting /lock-atom -> /bids
  if (pathname.startsWith("/lock-atom")) {
    const response = NextResponse.redirect(new URL("/bids", request.url))
    response.headers.set("x-pathname", pathname)
    return response
  }

  const response = NextResponse.next()
  response.headers.set("x-pathname", pathname)
  return response
}
