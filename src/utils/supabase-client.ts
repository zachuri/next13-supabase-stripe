import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { Database } from "@/types/supabase.db"

export const createSupabaseBrowserClient = () =>
  createClientComponentClient<Database>()
