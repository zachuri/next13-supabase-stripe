import { Database } from "./supabase.db"

export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
