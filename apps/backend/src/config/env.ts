import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3001),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
  SUPABASE_URL: z.string().optional().default(""),
  SUPABASE_SERVICE_KEY: z.string().optional().default(""),
  GROQ_API_KEY: z.string().optional().default(""),
  OPENROUTER_API_KEY: z.string().optional().default(""),
  OPENROUTER_SITE_URL: z.string().optional().default(""),
  OPENROUTER_APP_NAME: z.string().optional().default("SpecPilot AI")
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error(`Invalid environment variables: ${JSON.stringify(parsedEnv.error.flatten().fieldErrors)}`);
}

export const env = {
  ...parsedEnv.data,
  isMockMode:
    !parsedEnv.data.SUPABASE_URL ||
    !parsedEnv.data.SUPABASE_SERVICE_KEY ||
    (!parsedEnv.data.GROQ_API_KEY && !parsedEnv.data.OPENROUTER_API_KEY)
};
