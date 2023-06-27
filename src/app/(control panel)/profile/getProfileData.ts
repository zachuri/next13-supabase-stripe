// Actions for getting profile data from supabase

import { createSupabaseServerClient } from "@/utils/supabase-server"

import { Profile } from "@/types/profile"

export const getUserProfile = async (user_id: string): Promise<Profile> => {
  const supabase = createSupabaseServerClient()

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user_id)
    .single()

  if (error) {
    console.log(error)
  }

  return data as Profile
}
