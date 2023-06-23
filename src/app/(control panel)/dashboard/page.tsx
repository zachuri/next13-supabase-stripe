"use client"

import React from "react"

import { useUser } from "@/hooks/useUser"

export default function Page() {
  const user = useUser()

  return (
    <>
      <div>Dashboard</div>
      <pre>{user.user?.id}</pre>
    </>
  )
}
