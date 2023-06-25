"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSessionContext } from "@supabase/auth-helpers-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Profile } from "@/types/profile"
import { cn } from "@/lib/utils"
import { userNameSchema } from "@/lib/validations/user"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface UserNameFormProps extends React.HTMLAttributes<HTMLFormElement> {
  user: Pick<
    Profile,
    "id" | "full_name" | "username" | "avatar_url" | "website"
  >
}

type FormData = z.infer<typeof userNameSchema>

export function UserNameForm({ user, className, ...props }: UserNameFormProps) {
  const { supabaseClient } = useSessionContext()

  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userNameSchema),
    defaultValues: {
      name: user?.full_name || "",
      username: user?.username || "",
      website: user?.website || "",
    },
  })
  const [isSaving, setIsSaving] = React.useState<boolean>(false)

  async function onSubmit(data: FormData) {
    setIsSaving(true)

    const { data: response, error } = await supabaseClient
      .from("profiles")
      .update({
        username: data.username,
        full_name: data.name,
        website: data.website,
      })
      .eq("id", user.id)

    setIsSaving(false)

    if (error) {
      if (error.code === "23505") {
        return toast({
          title: "Something went wrong.",
          description: "Username already exist. Please enter another",
          variant: "destructive",
        })
      }
      return toast({
        title: "Something went wrong.",
        description: "No updated was made",
        variant: "destructive",
      })
    }

    toast({
      description: "Your changes have been updated.",
    })

    router.refresh()
  }

  return (
    <form
      className={cn(className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle>Avatar Image</CardTitle>
        </CardHeader>
        <CardContent>
          <Avatar className="h-44 w-44 sm:h-60 sm:w-60">
            {user.avatar_url ? (
              <AvatarImage src={user.avatar_url}></AvatarImage>
            ) : (
              <AvatarFallback>
                <span className="sr-only">{user.username}</span>
                <Icons.user className="h-20 w-20" />
              </AvatarFallback>
            )}
          </Avatar>
        </CardContent>
        <CardHeader>
          <CardTitle>Your Name</CardTitle>
          <CardDescription>
            Please enter your full name or a display name you are comfortable
            with.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="name">
              Name
            </Label>
            <Input
              id="name"
              className="w-96 max-sm:w-60"
              size={32}
              placeholder="Please enter your full name"
              {...register("name")}
            />
            {errors?.name && (
              <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>
        </CardContent>
        <CardHeader>
          <CardTitle>Your Username</CardTitle>
          <CardDescription>
            Please enter a username you are comfortable with.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="name">
              Name
            </Label>
            <Input
              id="username"
              className="w-96 max-sm:w-60"
              size={32}
              placeholder="Please enter a username"
              {...register("username")}
            />
            {errors?.name && (
              <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>
        </CardContent>
        <CardHeader>
          <CardTitle>Your Website</CardTitle>
          <CardDescription>Please enter your personal website</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="name">
              Name
            </Label>
            <Input
              id="website"
              className="w-96 max-sm:w-60"
              size={32}
              placeholder="Please enter a website if you have one"
              {...register("website")}
            />
            {errors?.name && (
              <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <button
            type="submit"
            className={cn(buttonVariants(), className)}
            disabled={isSaving}
          >
            {isSaving && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>Save</span>
          </button>
        </CardFooter>
      </Card>
    </form>
  )
}
