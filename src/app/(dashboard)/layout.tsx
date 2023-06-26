import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/utils/supabase-server"

import { controlPanelConfig } from "@/config/control-panel"
import { getServerSession } from "@/lib/session"
import { Navbar } from "@/components/navbar"
import { SiteFooter } from "@/components/site-footer"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserAccountNav } from "@/components/user-account-nav"

interface DashboardLayoutProps {
  children?: React.ReactNode
}
export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const supabase = createSupabaseServerClient()
  const session = await getServerSession()

  if (!session) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single()

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <Navbar mainNav={controlPanelConfig.mainNav}>
        <ThemeToggle />
        <UserAccountNav
          user={{
            username: profile?.username ?? null,
            full_name: profile?.full_name ?? null,
            image: profile?.avatar_url ?? null,
            email: session.user.email ?? null,
          }}
        />
      </Navbar>
      <div className="container flex-1">
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
      <SiteFooter className="border-t" />
    </div>
  )
}
