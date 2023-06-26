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
    console.log("Hello:" + userData)
  }, [user.user, userData])

  console.log(userData)

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
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <CardHeader className="gap-2">
                {userData ? (
                  <>
                    <h1>User ID:{userData.id}</h1>
                    <h1>User Email: {userData.email}</h1>
                  </>
                ) : (
                  <>
                    <Skeleton className="h-5 w-1/5" />
                    <Skeleton className="h-4 w-4/5" />
                  </>
                )}
              </CardHeader>
            </CardContent>
          </Card>
        </>
      )}
    </>
  )
}
