import { createServerClient } from "utils/supabase-server"

import { dashboardConfig } from "@/config/dashboard"
// import { DashboardNav } from "@/components/nav"
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
  const supabase = createServerClient()
  const session = await supabase.auth.getSession()

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.data.session?.user.id)

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <Navbar config={dashboardConfig}>
        <ThemeToggle />
        <UserAccountNav
          user={{
            username: profiles?.[0]?.username ?? null,
            full_name: profiles?.[0]?.full_name ?? null,
            image: profiles?.[0]?.avatar_url ?? null,
            email: session.data.session?.user.email,
          }}
        />
      </Navbar>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          {/* <DashboardNav items={dashboardConfig.sidebarNav} /> */}
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
      <SiteFooter className="border-t" />
    </div>
  )
}
