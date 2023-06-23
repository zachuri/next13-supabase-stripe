import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import { Database } from "@/types/supabase.db"

export const createServerComponent = () =>
  createServerComponentClient<Database>({
    cookies,
  })
