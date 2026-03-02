import { NextResponse, type NextRequest } from "next/server"

import { AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE } from "@/lib/auth"

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const isAuthenticated =
    request.cookies.get(AUTH_COOKIE_NAME)?.value === AUTH_COOKIE_VALUE

  if (pathname.startsWith("/dashboard") && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url)
    const nextPath = `${pathname}${search}`
    loginUrl.searchParams.set("next", nextPath)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname === "/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}

