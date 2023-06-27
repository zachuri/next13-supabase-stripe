import { getServerSession } from "@/lib/session"
import { useUser } from "@/hooks/useUser"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CardSkeleton } from "@/components/card-skeleton"
import { Icons } from "@/components/icons"

import { getUserProfile } from "./getProfileData"

export default async function Page() {
  const session = await getServerSession()
  const profile = await getUserProfile(session.user.id)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Card>
            <CardHeader>
              <CardTitle>Avatar</CardTitle>
            </CardHeader>
            <CardContent>
              <Avatar className="h-44 w-44 sm:h-60 sm:w-60">
                {profile.avatar_url ? (
                  <AvatarImage src={profile.avatar_url}></AvatarImage>
                ) : (
                  <AvatarFallback>
                    <span className="sr-only">{profile.username}</span>
                    <Icons.user className="h-20 w-20" />
                  </AvatarFallback>
                )}
              </Avatar>
            </CardContent>
            <CardHeader>
              <CardTitle>Name</CardTitle>
            </CardHeader>
            <CardContent>
              {profile.full_name
                ? profile.full_name
                : "Please go in settings and add your full name"}
            </CardContent>
            <CardHeader>
              <CardTitle>Username</CardTitle>
            </CardHeader>
            <CardContent>
              {profile.username
                ? profile.username
                : "Please go in settings and add a user name"}
            </CardContent>
            <CardHeader>
              <CardTitle>Website</CardTitle>
            </CardHeader>
            <CardContent>{profile?.website ? profile.website : "Please go in settings and add a website"}</CardContent>
          </Card>
        </CardContent>
      </Card>
    </>
  )
}
