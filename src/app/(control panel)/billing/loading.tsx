import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ControlPanelHeader } from "@/components/header"
import { ControlPanelShell } from "@/components/shell"

function CardSkeleton() {
  return (
    <Card>
      <CardHeader className="gap-2">
        <Skeleton className="h-9 w-1/5" />
        <Skeleton className="h-4 w-2/5" />
      </CardHeader>
      <CardContent>
        <Card className="w-96 max-sm:w-60">
          <CardHeader className="gap-2">
            <Skeleton className="h-9 w-2/5" />
            <Skeleton className="h-4 w-4/5" />
          </CardHeader>
          <CardFooter>
            <Skeleton className="h-10 w-[120px]" />
          </CardFooter>
        </Card>
      </CardContent>
    </Card>
  )
}

export default function BillingLoading() {
  return (
    <ControlPanelShell>
      <ControlPanelHeader
        heading="Billing"
        text="Manage billing and your subscription plan."
      />
      <div className="grid gap-10">
        <CardSkeleton />
      </div>
    </ControlPanelShell>
  )
}
