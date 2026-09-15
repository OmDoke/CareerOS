import { z } from "zod";

export const evaluateAnswerSchema = z.object({
  body: z.object({
    questionId: z.string().min(1, "Question ID is required"),
    studyTaskId: z.string().min(1, "Study Task ID is required"),
    studySessionId: z.string().min(1, "Study Session ID is required"),
    roadmapTopicId: z.string().min(1, "Roadmap Topic ID is required"),
    
    question: z.string().min(1, "Question is required"),
    questionType: z.string().min(1, "Question Type is required"),
    difficulty: z.string().min(1, "Difficulty is required"),
    
    userAnswer: z.string().min(1, "User Answer is required"),
    timeTaken: z.number().min(0).optional(),
  }),
});
