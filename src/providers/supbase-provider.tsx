"use client"

import { useState } from "react"
import { createSupabaseBrowserClient } from "@/utils/supabase-client"
import { Session } from "@supabase/auth-helpers-nextjs"
import { SessionContextProvider } from "@supabase/auth-helpers-react"

import SupabaseAuthListener from "./supabase-auth-listener"

type MaybeSession = Session | null

interface SupabaseProviderProps {
  children: React.ReactNode
  session: MaybeSession
}

const SupabaseProvider: React.FC<SupabaseProviderProps> = ({
  children,
  session,
}) => {
  const [supabaseClient] = useState(() => createSupabaseBrowserClient())

  return (
    // SessionContextProvider created by supabase to pass session to client as a context provider
    <SessionContextProvider supabaseClient={supabaseClient}>
      {/* SupabaseListenr -> anytime user logs in/out: it rerender when session changes */}
      {/* had problems when logged out, would be session of orignal user  */}
      {/* this fixes the problem! */}
      <SupabaseAuthListener serverAccessToken={session?.access_token} />
      {children}
    </SessionContextProvider>
  )
}

export default SupabaseProvider
