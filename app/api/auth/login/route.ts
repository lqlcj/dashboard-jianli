import { NextResponse } from "next/server"

import { AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE } from "@/lib/auth"

export const runtime = "edge"

const VALID_USERNAME = "admin"
const VALID_PASSWORD = "123456"

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { username?: string; password?: string }
    | null

  const username = body?.username?.trim()
  const password = body?.password

  if (username !== VALID_USERNAME || password !== VALID_PASSWORD) {
    return NextResponse.json(
      { message: "Invalid username or password" },
      { status: 401 }
    )
  }

  const response = NextResponse.json({ ok: true })
  const isHttps = new URL(request.url).protocol === "https:"
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: AUTH_COOKIE_VALUE,
    httpOnly: true,
    sameSite: "lax",
    secure: isHttps,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })

  return response
}
