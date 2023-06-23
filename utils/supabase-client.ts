import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs"

import { Database } from "@/types/supabase.db"

export const createClientComponent = () => createPagesBrowserClient<Database>()
