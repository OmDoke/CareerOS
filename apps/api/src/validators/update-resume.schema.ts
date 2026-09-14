import { z } from "zod";

const jsonStringTransform = z
  .any()
  .transform((v) => (typeof v === "string" ? v : JSON.stringify(v)))
  .optional();

export const updateResumeSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional(),
    skills: jsonStringTransform,
    education: jsonStringTransform,
    experience: jsonStringTransform,
    projects: jsonStringTransform,
  }),
});
