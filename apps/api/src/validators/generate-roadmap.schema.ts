import { z } from "zod";

export const generateRoadmapSchema = z.object({
  body: z.object({
    targetRole: z.string().min(2, "Target role is required"),
    force: z.boolean().optional().default(false),
  }),
});
