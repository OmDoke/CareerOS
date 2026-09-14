import { z } from "zod";

export const analyzeResumeSchema = z.object({
  body: z.object({
    force: z.boolean().optional().default(false),
  }),
});
