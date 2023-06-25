"use client"

import React, { useEffect, useState } from "react"

import { useUser } from "@/hooks/useUser"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CardSkeleton } from "@/components/card-skeleton"

export default function Page() {
  const user = useUser()

  const [userData, setUserData] = useState(user.user)

  useEffect(() => {
    setUserData(user.user)
  }, [user])

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
              <>
                <h1>{userData?.id}</h1>
                <h1>{userData?.email}</h1>
              </>
            </CardContent>
          </Card>
        </>
      )}
    </>
  )
}
