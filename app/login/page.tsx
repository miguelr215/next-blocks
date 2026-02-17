import SmallLogo from "@/components/ui/smallLogo"

import { LoginForm } from "@/components/login-form"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-8 items-center justify-center">
            <SmallLogo />
          </div>
          Sports Blocks
        </Link>
        <LoginForm />
      </div>
    </div>
  )
}
