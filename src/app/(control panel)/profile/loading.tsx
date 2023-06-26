import { CardSkeleton } from "@/components/card-skeleton"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export default function ProfileLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Posts" text="Manage your posts" />
      <div className="grid gap-10">
        <CardSkeleton />
      </div>
    </DashboardShell>
  )
}
