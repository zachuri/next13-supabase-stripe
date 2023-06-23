import { createSupabaseServerClient } from "utils/supabase-server"

import { controlPanelConfig } from "@/config/control-panel"
import { ControlPanelNav } from "@/components/control-panel-nav"
import { Navbar } from "@/components/navbar"
import { SiteFooter } from "@/components/site-footer"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserAccountNav } from "@/components/user-account-nav"

interface ControlPanelLayoutProps {
  children?: React.ReactNode
}
export default async function DashboardLayout({
  children,
}: ControlPanelLayoutProps) {
  const supabase = createSupabaseServerClient()
  const session = await supabase.auth.getSession()

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.data.session?.user.id)
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
            email: session.data.session?.user.email,
          }}
        />
      </Navbar>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <ControlPanelNav items={controlPanelConfig.sidebarNav} />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
      <SiteFooter className="border-t" />
    </div>
  )
}
