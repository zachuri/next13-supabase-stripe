import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/utils/supabase-server"

import getUserSubscriptionPlan from "@/lib/subscription"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BillingForm } from "@/components/billing-form"
import { DashboardHeader } from "@/components/header"
import { Icons } from "@/components/icons"
import { DashboardShell } from "@/components/shell"

import getActiveProductsWithPrices from "./getActiveProductsWithPrices"

export const metadata = {
  title: "Billing",
  description: "Manage billing and your subscription plan.",
}

export default async function BillingPage() {
  const supabase = createSupabaseServerClient()
  const session = await supabase.auth.getSession()

  const user = session.data.session?.user

  if (!user) {
    redirect("/login")
  }

  // If user has a pro plan, check cancel status on Stripe.
  let isCanceled = false
  // if (subscriptionPlan.isPro && subscriptionPlan.stripeSubscriptionId) {
  //   const stripePlan = await stripe.subscriptions.retrieve(
  //     subscriptionPlan.stripeSubscriptionId
  //   )
  //   isCanceled = stripePlan.cancel_at_period_end
  // }

  const products = await getActiveProductsWithPrices()

  const subscriptionPlan = await getUserSubscriptionPlan({
    user_id: user.id,
  })

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Billing"
        text="Manage billing and your subscription plan."
      />
      <div className="grid gap-8">
        <Alert className="!pl-14">
          <Icons.warning />
          <AlertTitle>This is a demo app.</AlertTitle>
          <AlertDescription>
            Taxonomy app is a demo app using a Stripe test environment. You can
            find a list of test card numbers on the{" "}
            <a
              href="https://stripe.com/docs/testing#cards"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-8"
            >
              Stripe docs
            </a>
            .
          </AlertDescription>
        </Alert>
        <h1>USER ID: {user.id}</h1>
        <h1>SUBSCRIPTION ID ID: {subscriptionPlan?.id}</h1>
        <BillingForm
          subscriptionPlan={subscriptionPlan}
          isCanceled={isCanceled}
          products={products}
        />
      </div>
    </DashboardShell>
  )
}
