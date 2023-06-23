import * as z from "zod"

export const userAuthSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6)
    .refine((value) => {
      // Password must contain at least one number
      return /\d/.test(value)
    }, "Password must contain at least one number")
    .refine((value) => {
      // Password must contain at least one special character
      return /[!@#$%^&*]/.test(value)
    }, "Password must contain at least one special character")
    .refine((value) => {
      // Password must contain at least one capital letter
      return /[A-Z]/.test(value);
    }, "Password must contain at least one capital letter"),
  confirmPassword: z.string().min(6),
})
