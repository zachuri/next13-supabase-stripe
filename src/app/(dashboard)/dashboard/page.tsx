import React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Page() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          </CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Card Title</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Content Example</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Card Title</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Content Example</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Card Title</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Content Example</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Card Title</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Content Example</div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </>
  )
}
