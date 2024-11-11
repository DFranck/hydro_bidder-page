import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  // TODO: remove this hardcoded redirect
  if (request.nextUrl.pathname === "/lock-atom") {
    return NextResponse.redirect(new URL("/voting", request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: "/lock-atom",
}
