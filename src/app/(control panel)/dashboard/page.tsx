"use client"

import React from "react"

import { useUser } from "@/hooks/useUser"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CardSkeleton } from "@/components/card-skeleton"

export default function Page() {
  const user = useUser()

  return (
    <>
      {user.isLoading ? (
        <>
          <CardSkeleton />
        </>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <pre>{user.user?.id}</pre>
              <pre>{user.user?.email}</pre>
            </CardContent>
          </Card>
        </>
      )}
    </>
  )
}
