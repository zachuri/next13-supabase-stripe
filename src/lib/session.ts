import { Session } from "@supabase/auth-helpers-nextjs"
import { createServerComponent } from "utils/supabase-server"

export const getServerSession = async (): Promise<Session> => {
  const supabase = createServerComponent()

  const { data, error } = await supabase.auth.getSession()

  if (error) {
    console.log(error.message)
  }

  return data.session as Session
}

/*
  Notes
    - to get server Session -> useUser hook
*/
