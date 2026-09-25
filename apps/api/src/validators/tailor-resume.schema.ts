import { z } from "zod";

export const tailorResumeSchema = z.object({
  body: z.object({
    jobDescription: z.string({
      required_error: "Job description is required",
    }).min(10, "Job description is too short"),
  }),
});
