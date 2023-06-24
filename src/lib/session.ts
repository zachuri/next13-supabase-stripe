import { createSupabaseServerClient } from "@/utils/supabase-server"
import { Session } from "@supabase/auth-helpers-nextjs"

export const getServerSession = async (): Promise<Session> => {
  const supabase = createSupabaseServerClient()

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
