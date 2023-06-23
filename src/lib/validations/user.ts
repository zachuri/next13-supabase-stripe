import * as z from "zod"

export const userNameSchema = z.object({
  name: z.string().min(3).max(32),
  username: z.string().min(3).max(32),
  website: z.string().min(3).max(100),
})
