import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import { stripe } from "@/lib/stripe"
import { createOrRetrieveCustomer } from "@/lib/supabase-admin"
import { getURL } from "@/lib/utils"

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({
      cookies,
    })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw Error("Could not get user")
    const customer = await createOrRetrieveCustomer({
      uuid: user.id || "",
      email: user.email || "",
    })

    if (!customer) throw Error("Could not get customer")
    const { url } = await stripe.billingPortal.sessions.create({
      customer,
      return_url: `${getURL()}/billing`,
    })

    return NextResponse.json({ url })
  } catch (err: any) {
    console.log(err)
    new NextResponse("Internal Error", { status: 500 })
  }
}
