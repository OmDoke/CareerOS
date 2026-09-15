import { prisma } from "../database";
import { geminiProvider } from "../providers/gemini.provider";
import { getEvaluationPrompt } from "@career-os/prompts";
import { EvaluationContext, EvaluationResult } from "../types/evaluation.types";
import { mapEvaluationToDb } from "../utils/evaluation.mapper";
import { AppError } from "../errors/custom-errors";
import { logger } from "../utils/logger";
import { masteryService } from "./mastery.service";
import { reviewService } from "./review.service";
import { analyticsService } from "./analytics.service";

export class EvaluationService {
  async evaluateAnswer(userId: string, data: any) {
    try {
      const {
        questionId,
        studyTaskId,
        studySessionId,
        roadmapTopicId,
        question,
        questionType,
        difficulty,
        userAnswer,
        timeTaken,
      } = data;

      // 1. Fetch required context
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          resume: true,
          roadmap: {
            include: {
              modules: {
                include: {
                  topics: true,
                },
              },
            },
          },
        },
      });

      if (!user || !user.roadmap || !user.resume) {
        throw new AppError("User context not found", 404);
      }

      const roadmap = user.roadmap;
      const resume = user.resume;

      // Find the current module and topic
      let currentModuleTitle = "";
      let currentTopicTitle = "";
      for (const mod of roadmap.modules) {
        const topic = mod.topics.find((t) => t.id === roadmapTopicId);
        if (topic) {
          currentModuleTitle = mod.title;
          currentTopicTitle = topic.title;
          break;
        }
      }

      // 2. Fetch previous attempts for context
      const previousAttempts = await prisma.questionAttempt.findMany({
        where: {
          userId,
          status: "SUBMITTED",
        },
        orderBy: {
          submittedAt: "desc",
        },
        take: 5,
        select: {
          question: true,
          overallScore: true,
          status: true,
        },
      });

      // 3. Prepare Evaluation Context
      const context: EvaluationContext = {
        questionId,
        studyTaskId,
        studySessionId,
        roadmapTopicId,
        question,
        questionType,
        difficulty,
        userAnswer,
        timeTaken,
        
        targetRole: roadmap.targetRole,
        studyGoal: roadmap.title,
        roadmapModule: currentModuleTitle,
        currentTopic: currentTopicTitle,
        resumeSummary: resume.aiSummary || "",
        resumeSkills: resume.skills || "",
        previousAttempts: previousAttempts.map(a => ({
          question: a.question,
          score: a.overallScore,
          status: a.status,
        })),
        currentWeakTopics: [], // Simplify for now or fetch based on masteryPercentage < 50
        currentStrongTopics: [], // Simplify for now or fetch based on masteryPercentage > 80
      };

      // 4. Call Gemini
      const prompt = getEvaluationPrompt(context);
      let evaluation: EvaluationResult;
      try {
        evaluation = await geminiProvider.generateJSON(prompt);
      } catch (geminiError) {
        // Fallback retry once if malformed
        logger.warn("Gemini parsing failed, retrying once...");
        evaluation = await geminiProvider.generateJSON(prompt);
      }

      // 5. Update DB in Transaction
      const mappedData = mapEvaluationToDb(evaluation, "gemini-3.6-flash", 0);

      const result = await prisma.$transaction(async (tx) => {
        // Update or Create QuestionAttempt
        // The attempt should already exist as PENDING when the question was generated
        // But if it doesn't, we can't evaluate it properly? Actually the frontend might send an existing attempt id as questionId.
        // Wait, questionId from frontend usually is the QuestionAttempt ID!
        
        const attempt = await tx.questionAttempt.update({
          where: { id: questionId }, // Assuming questionId is the attempt id
          data: {
            ...mappedData,
            userAnswer,
            questionType,
            timeTaken,
            status: "SUBMITTED",
            submittedAt: new Date(),
          },
        });

        // Update RoadmapTopic mastery
        if (evaluation.topicMasteryDelta !== 0) {
          const topic = await tx.roadmapTopic.findUnique({ where: { id: roadmapTopicId } });
          if (topic) {
            const newMastery = Math.min(100, Math.max(0, topic.masteryPercentage + evaluation.topicMasteryDelta));
            await tx.roadmapTopic.update({
              where: { id: roadmapTopicId },
              data: { masteryPercentage: newMastery },
            });
          }
        }

        return attempt;
      });

      // After transaction completes, update mastery, scheduling, and analytics
      const newMastery = await masteryService.updateTopicMastery(roadmapTopicId);
      await reviewService.scheduleNextReview(roadmapTopicId, newMastery);
      await analyticsService.updateStudyStreak(userId);

      return result;

    } catch (error: any) {
      logger.error({ err: error }, "Failed to evaluate answer details");
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || "Failed to evaluate answer", 500);
    }
  }

  async getHistory(userId: string) {
    return prisma.questionAttempt.findMany({
      where: { userId, status: "SUBMITTED" },
      orderBy: { submittedAt: "desc" },
      include: { topic: { select: { title: true } } },
    });
  }

  async getAttemptById(userId: string, id: string) {
    const attempt = await prisma.questionAttempt.findUnique({
      where: { id },
      include: { topic: true },
    });
    if (!attempt || attempt.userId !== userId) {
      throw new AppError("Attempt not found", 404);
    }
    return attempt;
  }

  async getStatistics(userId: string) {
    const attempts = await prisma.questionAttempt.findMany({
      where: { userId, status: "SUBMITTED" },
    });

    const totalAttempts = attempts.length;
    const averageScore = attempts.reduce((acc, curr) => acc + (curr.overallScore || 0), 0) / (totalAttempts || 1);
    
    const theoryAttempts = attempts.filter(a => a.questionType === "THEORY");
    const codingAttempts = attempts.filter(a => a.questionType === "CODE");

    const theoryAccuracy = theoryAttempts.reduce((acc, curr) => acc + (curr.overallScore || 0), 0) / (theoryAttempts.length || 1);
    const codingAccuracy = codingAttempts.reduce((acc, curr) => acc + (curr.overallScore || 0), 0) / (codingAttempts.length || 1);

    const bestScore = attempts.reduce((acc, curr) => Math.max(acc, curr.overallScore || 0), 0);
    const worstScore = attempts.length > 0 ? attempts.reduce((acc, curr) => Math.min(acc, curr.overallScore || 100), 100) : 0;
    
    // Average time taken
    const totalTime = attempts.reduce((acc, curr) => acc + (curr.timeTaken || 0), 0);
    const averageTime = totalTime / (totalAttempts || 1);

    return {
      totalAttempts,
      averageScore,
      bestScore,
      worstScore,
      theoryAccuracy,
      codingAccuracy,
      averageTime,
    };
  }

  async getTopicStats(userId: string, topicId: string) {
    const topic = await prisma.roadmapTopic.findUnique({ where: { id: topicId } });
    if (!topic) throw new AppError("Topic not found", 404);

    const attempts = await prisma.questionAttempt.findMany({
      where: { userId, topicId, status: "SUBMITTED" },
    });

    const averageScore = attempts.reduce((acc, curr) => acc + (curr.overallScore || 0), 0) / (attempts.length || 1);

    return {
      topicId,
      masteryPercentage: topic.masteryPercentage,
      totalAttempts: attempts.length,
      averageScore,
    };
  }
}

export const evaluationService = new EvaluationService();
