"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { createClientComponent } from "utils/supabase-client"

import { useUser } from "@/hooks/useUser"

export default function Page() {
  const user = useUser()
  const supabase = createClientComponent()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push(`${window.location.origin}/login`)
  }

  return (
    <>
      <div>Dashboard</div>
      <pre>{user.user?.id}</pre>
      <button onClick={handleSignOut}>Sign out</button>
    </>
  )
}
