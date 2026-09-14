import { z } from "zod";

export const generateQuestionSchema = z.object({
  body: z.object({
    sessionId: z.string().min(1, "Session ID is required"),
    taskId: z.string().min(1, "Task ID is required"),
  }),
});

export const skipQuestionSchema = z.object({
  body: z.object({
    attemptId: z.string().min(1, "Attempt ID is required"),
  }),
});

export const getHintSchema = z.object({
  body: z.object({
    attemptId: z.string().min(1, "Attempt ID is required"),
    userAnswer: z.string().nullable().optional(),
  }),
});

export const getExplanationSchema = z.object({
  body: z.object({
    attemptId: z.string().min(1, "Attempt ID is required"),
  }),
});
