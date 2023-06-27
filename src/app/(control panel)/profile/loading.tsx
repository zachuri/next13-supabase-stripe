import { CardSkeleton } from "@/components/card-skeleton"
import { ControlPanelHeader } from "@/components/header"
import { ControlPanelShell } from "@/components/shell"

export default function ProfileLoading() {
  return (
    <ControlPanelShell>
      <ControlPanelHeader heading="Posts" text="Manage your posts" />
      <div className="grid gap-10">
        <CardSkeleton />
      </div>
    </ControlPanelShell>
  )
}
