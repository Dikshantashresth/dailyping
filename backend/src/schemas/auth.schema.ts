import { z } from "zod";

export const registerSchema = z.object({
  email: z.email("Email"),
  password: z.string().min(8),
  username: z.string().min(3).max(50),
 
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});



export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

