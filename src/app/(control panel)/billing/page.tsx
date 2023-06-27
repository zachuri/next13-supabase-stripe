import { isUint8ClampedArray } from "util/types"
import { redirect } from "next/navigation"

import { getServerSession } from "@/lib/session"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ControlPanelHeader } from "@/components/header"
import { Icons } from "@/components/icons"
import { ControlPanelShell } from "@/components/shell"

import { BillingForm } from "./billing-form"
import {
  getActiveProductsWithPrices,
  getUserSubscriptionPlan,
} from "./getStripeData"

export const metadata = {
  title: "Billing",
  description: "Manage billing and your subscription plan.",
}

export default async function BillingPage() {
  // Get user session from server
  const session = await getServerSession()

  // check if user is logged in
  if (!session.user) redirect("/login")

  // If user has a pro plan, check cancel status on Stripe.
  const subscriptionPlan = await getUserSubscriptionPlan(session.user.id)

  // Check if user cancled
  // if cancel_at_period_end is null default value will equal to false
  let isCanceled = false
  isCanceled = subscriptionPlan?.cancel_at_period_end ?? false

  // Obtain products from stripe
  const products = await getActiveProductsWithPrices()

  return (
    <ControlPanelShell>
      <ControlPanelHeader
        heading="Billing"
        text="Manage billing and your subscription plan."
      />
      <div className="grid gap-8">
        <Alert className="!pl-14">
          <Icons.warning />
          <AlertTitle>This is a demo app.</AlertTitle>
          <AlertDescription>
            This app is a demo app using a Stripe test environment. You can find
            a list of test card numbers on the{" "}
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
        <BillingForm
          subscriptionPlan={subscriptionPlan}
          isCanceled={isCanceled}
          products={products}
        />
      </div>
    </ControlPanelShell>
  )
}
