import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must not be more than 20 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores"
  );

export const signUpSchema = z.object({
  userName: userNameValidation,
  email: z
    .string()
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    // Uncomment the regex below to enforce password strength rules
    // .regex(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
    //   "Password must include uppercase, lowercase, number, and special character"
    // )
});
