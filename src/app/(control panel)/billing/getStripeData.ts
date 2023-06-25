/**
 * The code exports two functions that use Supabase to retrieve active products with prices and a
 * user's subscription plan.
 * @returns The code exports two functions: `getActiveProductsWithPrices` and
 * `getUserSubscriptionPlan`.
 */

// actions for getting stripe data from supabase

import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import { ProductWithPrice, Subscription } from "@/types/stripe"

export const getActiveProductsWithPrices = async (): Promise<
  ProductWithPrice[]
> => {
  const supabase = createServerComponentClient({
    cookies: cookies,
  })

  const { data, error } = await supabase
    .from("products")
    .select("*, prices(*)")
    .eq("active", true)
    .eq("prices.active", true)
    .order("metadata->index")
    .order("unit_amount", { foreignTable: "prices" })

  if (error) {
    console.log(error.message)
  }

  return (data as ProductWithPrice[]) || []
}

export const getUserSubscriptionPlan = async (
  user_id: string
): Promise<Subscription> => {
  const supabase = createServerComponentClient({
    cookies: cookies,
  })

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*, prices(*, products(*))")
    .in("status", ["trialing", "active"])
    .eq("user_id", user_id)
    .single()

  if (error) {
    console.log(error)
  }

  return data
}
