"use client"

import { createContext, useContext, useState } from "react"
import { createSupabaseBrowserClient } from "@/utils/supabase-client"
import type { Session } from "@supabase/auth-helpers-nextjs"

import type { TypedSupabaseClient } from "@/app/layout"

type MaybeSession = Session | null

type SupabaseContext = {
  supabase: TypedSupabaseClient
  session: MaybeSession
}

// @ts-ignore
const Context = createContext<SupabaseContext>()

export default function SupabaseProvider({
  children,
  session,
}: {
  children: React.ReactNode
  session: MaybeSession
}) {
  const [supabase] = useState(() => createSupabaseBrowserClient())

  return (
    <Context.Provider value={{ supabase, session }}>
      <>{children}</>
    </Context.Provider>
  )
}

export const useSupabase = () => useContext(Context)
