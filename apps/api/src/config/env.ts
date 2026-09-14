import { z } from "zod";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

const envSchema = z.object({
  PORT: z.string().default("3001"),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().default("super_secret_jwt_key_career_os_dev"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  GEMINI_API_KEY: z.string().optional().default(""), // Optional for now so dev doesn't crash if not provided, but handled in provider
});

export const env = envSchema.parse(process.env);
