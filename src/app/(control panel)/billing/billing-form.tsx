"use client"

import * as React from "react"
import { getStripe } from "@/utils/stripe-client"

import { Price, ProductWithPrice, Subscription } from "@/types/stripe"
import { postData } from "@/lib/stripe-helper"
import { cn, formatDate } from "@/lib/utils"
import { useUser } from "@/hooks/useUser"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

const formatPrice = (price: Price) => {
  const priceString = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    minimumFractionDigits: 0,
  }).format((price?.unit_amount || 0) / 100)

  return priceString
}

interface BillingFormProps extends React.HTMLAttributes<HTMLFormElement> {
  subscriptionPlan: Subscription
  isCanceled: boolean
  products: ProductWithPrice[]
}

export function BillingForm({
  subscriptionPlan,
  isCanceled,
  products,
  className,
  ...props
}: BillingFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onSubmit(price: Price) {
    setIsLoading(!isLoading)

    try {
      const { sessionId } = await postData({
        url: "/api/create-checkout-session",
        data: { price },
      })

      const stripe = await getStripe()
      stripe?.redirectToCheckout({ sessionId })
    } catch (error) {
      console.log("Error" + error)
      return toast({
        title: "Something went wrong.",
        description: `${(error as Error)?.message}`,
        variant: "destructive",
      })
    }
  }

  const redirectToCustomerPortal = async () => {
    try {
      const { url, error } = await postData({
        url: "/api/create-portal-link",
      })
      window.location.assign(url)
    } catch (error) {
      if (error) return alert((error as Error).message)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Plan</CardTitle>
        <CardDescription>
          You are currently on the <strong>{subscriptionPlan?.status}</strong>{" "}
          plan.
        </CardDescription>
      </CardHeader>

      {/* Can display multiple products */}
      {/* Make sure to have webhook on to update */}
      <CardContent>
        {products && (
          <div className="grid-cols grid space-y-4">
            {products.map((product) => {
              return (
                <Card key={product.id} className="w-96 max-sm:w-60">
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>

                  {product.prices?.map((price) => {
                    return (
                      <CardFooter
                        key={price.id}
                        className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-2"
                      >
                        <>
                          <button
                            className={cn(buttonVariants())}
                            disabled={isLoading}
                            onClick={() => {
                              subscriptionPlan?.status === "active"
                                ? redirectToCustomerPortal()
                                : onSubmit(price)
                            }}
                          >
                            {isLoading && (
                              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {subscriptionPlan?.status === "active"
                              ? "Manage Subscription"
                              : `Subscribe for ${formatPrice(price)}`}
                          </button>
                          {subscriptionPlan?.status ? (
                            <p className="rounded-full text-xs font-medium">
                              {isCanceled
                                ? "Your plan will be canceled on "
                                : "Your plan renews on "}
                              {formatDate(subscriptionPlan?.current_period_end)}
                              .
                            </p>
                          ) : null}
                        </>
                      </CardFooter>
                    )
                  })}
                </Card>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
