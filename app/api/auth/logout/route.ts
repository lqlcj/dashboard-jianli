import { NextResponse } from "next/server"

import { AUTH_COOKIE_NAME } from "@/lib/auth"

export const runtime = "edge"

export async function POST(request: Request) {
  const response = NextResponse.json({ ok: true })
  const isHttps = new URL(request.url).protocol === "https:"
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: isHttps,
    path: "/",
    maxAge: 0,
  })
  return response
}
