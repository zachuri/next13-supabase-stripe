import { cookies } from "next/headers"
import {
  Session,
  createClientComponentClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs"

export const getServerSession = async (): Promise<Session> => {
  const supabase = createServerComponentClient({
    cookies: cookies,
  })

  const { data, error } = await supabase.auth.getSession()

  if (error) {
    console.log(error.message)
  }

  return data.session as Session
}

export const getClientSession = async (): Promise<Session> => {
  const supabase = createClientComponentClient()

  const { data, error } = await supabase.auth.getSession()

  if (error) {
    console.log(error.message)
  }

  return data.session as Session
}
