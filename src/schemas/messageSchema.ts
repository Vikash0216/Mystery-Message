import { z } from "zod";

export const messgeSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Message must be atleast 1 character" })
    .max(300, { message: "Message should not be more than 300 characters" }),
});
