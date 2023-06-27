import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ControlPanelHeader } from "@/components/header"
import { ControlPanelShell } from "@/components/shell"

function CardSkeleton() {
  return (
    <Card>
      <CardHeader className="gap-3">
        <Skeleton className="h-10 w-1/5" />
        <Skeleton className="h-44 w-44 rounded-full sm:h-60 sm:w-60" />
      </CardHeader>
      <CardHeader className="gap-3">
        <Skeleton className="h-10 w-1/5" />
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-10 w-2/5" />
      </CardHeader>
      <CardHeader className="gap-3">
        <Skeleton className="h-10 w-1/5" />
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-10 w-2/5" />
      </CardHeader>
      <CardHeader className="gap-3">
        <Skeleton className="h-10 w-1/5" />
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-10 w-2/5" />
      </CardHeader>
      <CardContent className="gap-3" />
      <CardFooter>
        <Skeleton className="h-8 w-[120px]" />
      </CardFooter>
    </Card>
  )
}

export default function SettingsLoading() {
  return (
    <ControlPanelShell>
      <ControlPanelHeader
        heading="Settings"
        text="Manage account and website settings."
      />
      <div className="grid gap-10">
        <CardSkeleton />
      </div>
    </ControlPanelShell>
  )
}
