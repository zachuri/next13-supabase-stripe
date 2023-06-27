import { createSupabaseServerClient } from "@/utils/supabase-server"

import { getServerSession } from "@/lib/session"
import { ControlPanelHeader } from "@/components/header"
import { ControlPanelShell } from "@/components/shell"

import { UserNameForm } from "./user-name-form"

// import { UserNameForm } from "@/components/user-name-form"

export const metadata = {
  title: "Settings",
  description: "Manage account and website settings.",
}

export default async function SettingsPage() {
  const supabase = createSupabaseServerClient()
  const session = await getServerSession()

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single()

  return (
    <ControlPanelShell>
      <ControlPanelHeader
        heading="Settings"
        text="Manage account and website settings."
      />
      <div className="grid gap-10">
        <UserNameForm
          user={{
            id: session.user.id,
            full_name: profiles?.full_name || "",
            username: profiles?.username || "",
            avatar_url: profiles?.avatar_url || "",
            website: profiles?.website || "",
          }}
        />
      </div>
    </ControlPanelShell>
  )
}
