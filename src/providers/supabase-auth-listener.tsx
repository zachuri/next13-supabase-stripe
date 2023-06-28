"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSessionContext } from "@supabase/auth-helpers-react"

// This component handles refreshing server data when the user logs in or out
// this method avoids the need to pass a session down to child components
// in order to re-render when the user's session changes
// #elegant!
interface Props {
  serverAccessToken?: string
}

export default function SupabaseAuthListener({ serverAccessToken }: Props) {
  // Obtain supabaseClientComponnt from SessionContextProvider
  const { supabaseClient } = useSessionContext()

  const router = useRouter()
  useEffect(() => {
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event, session) => {
      console.log(`Supabase auth event: ${event}`)
      if (session?.access_token !== serverAccessToken) {
        // server and client are out of sync
        // reload the page to fetch fresh server data
        // https://beta.nextjs.org/docs/data-fetching/mutating
        router.refresh()
      }

      if (
        // Uncomment it you want to always go to /login page
        // event === "SIGNED_OUT" ||
        !session?.expires_at ||
        session?.expires_at <= Math.floor(Date.now() / 1000)
      ) {
        // Delete cookies when the user signs out
        router.push("/login", { replace: true }) // Redirect to the login page
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [serverAccessToken, router, supabaseClient])

  return null
}
