import { LoginForm } from "@/components/login-form"

type LoginPageProps = {
  searchParams: Promise<{
    next?: string
  }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams
  const nextPath = typeof next === "string" && next.startsWith("/") ? next : "/dashboard"

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/40 p-4">
      <LoginForm nextPath={nextPath} />
    </main>
  )
}
