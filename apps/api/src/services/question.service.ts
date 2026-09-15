import { questionGeneratorService } from "./question-generator.service";
import { questionRepository } from "../repositories/question.repository";
import { resumeRepository } from "../repositories/resume.repository";
import { roadmapRepository } from "../repositories/roadmap.repository";
import { studySessionRepository } from "../repositories/study-session.repository";
import { NotFoundError, BadRequestError } from "../errors/custom-errors";
import { prisma } from "../database";

export class QuestionService {
  async generateNextQuestion(userId: string, sessionId: string, taskId: string) {
    // Validate session and task
    const session = await studySessionRepository.findById(sessionId);
    if (!session || session.userId !== userId) {
      throw new NotFoundError("Study session not found.");
    }

    const task = await prisma.studyTask.findUnique({
      where: { id: taskId, sessionId },
      include: {
        topic: {
          include: {
            module: {
              include: {
                roadmap: true,
              },
            },
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundError("Study task not found.");
    }

    if (task.status === "COMPLETED") {
      throw new BadRequestError("Task is already completed.");
    }

    // Get context
    const resume = await resumeRepository.findByUserId(userId);
    if (!resume || !resume.aiSummary) {
      throw new BadRequestError("Resume analysis required.");
    }

    const previousAttemptsRaw = await questionRepository.getPreviousAttempts(sessionId, task.topicId);
    
    // Format previous attempts for the prompt
    const previousAttempts = previousAttemptsRaw.map((a: any) => ({
      question: a.question,
      score: a.overallScore,
      status: a.status,
    }));

    // Determine target difficulty (adaptive based on scores)
    // Simple logic: if last 2 were scored > 80, increase difficulty. If < 50, decrease.
    let targetDifficulty = task.topic.module.difficulty || "Beginner";
    if (previousAttempts.length >= 2) {
      const lastTwo = previousAttempts.slice(0, 2);
      const allHigh = lastTwo.every((a: any) => a.score && a.score >= 80);
      const allLow = lastTwo.every((a: any) => a.score && a.score <= 50);
      
      if (allHigh && targetDifficulty === "Beginner") targetDifficulty = "Intermediate";
      else if (allHigh && targetDifficulty === "Intermediate") targetDifficulty = "Advanced";
      else if (allLow && targetDifficulty === "Advanced") targetDifficulty = "Intermediate";
      else if (allLow && targetDifficulty === "Intermediate") targetDifficulty = "Beginner";
    }

    // Get all previous topics in module
    const previousTopicsRaw = await prisma.roadmapTopic.findMany({
      where: {
        moduleId: task.topic.moduleId,
        order: { lt: task.topic.order },
      },
    });
    const previousTopics = previousTopicsRaw.map((t: any) => t.title);

    // Call AI to generate
    const generated = await questionGeneratorService.generateQuestion({
      targetRole: task.topic.module.roadmap.targetRole,
      resumeSummary: resume.aiSummary,
      currentModule: task.topic.module.title,
      currentTopic: task.topic.title,
      previousTopics,
      targetDifficulty,
      previousAttempts,
      userId,
    });

    // We store the full JSON generated output into a single string for `question` in the DB for simplicity, 
    // or we can store just the question text and pass the rest to the frontend.
    // Given the DB schema only has `question` string, let's store the whole JSON stringified in `question`.
    const questionPayload = JSON.stringify(generated);

    const attempt = await questionRepository.createAttempt({
      userId,
      studySessionId: sessionId,
      studyTaskId: taskId,
      topicId: task.topicId,
      question: questionPayload,
      difficulty: generated.difficulty,
    });

    return {
      attemptId: attempt.id,
      topicId: task.topicId,
      question: generated,
    };
  }

  async skipQuestion(userId: string, attemptId: string) {
    const attempt = await questionRepository.getAttemptById(attemptId);
    if (!attempt || attempt.userId !== userId) {
      throw new NotFoundError("Question attempt not found.");
    }

    if (attempt.status !== "PENDING") {
      throw new BadRequestError("Only pending questions can be skipped.");
    }

    return questionRepository.updateAttempt(attemptId, {
      status: "SKIPPED",
    });
  }

  async getHint(userId: string, attemptId: string, userAnswer: string | null = null) {
    const attempt = await questionRepository.getAttemptById(attemptId);
    if (!attempt || attempt.userId !== userId) {
      throw new NotFoundError("Question attempt not found.");
    }
    
    // Ensure the payload is parsed back to get the actual text
    const parsedQuestion = JSON.parse(attempt.question);
    
    const hint = await questionGeneratorService.generateHint(userId, parsedQuestion.question, userAnswer);
    return { hint };
  }

  async getExplanation(userId: string, attemptId: string) {
    const attempt = await questionRepository.getAttemptById(attemptId);
    if (!attempt || attempt.userId !== userId) {
      throw new NotFoundError("Question attempt not found.");
    }

    const parsedQuestion = JSON.parse(attempt.question);
    const explanation = await questionGeneratorService.generateExplanation(userId, parsedQuestion.question);
    return { explanation };
  }
}

export const questionService = new QuestionService();
