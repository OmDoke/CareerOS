import { prisma } from "../database";

export class QuestionRepository {
  async createAttempt(data: {
    userId: string;
    studySessionId: string;
    studyTaskId: string;
    topicId: string;
    question: string;
    difficulty: string;
  }) {
    return prisma.questionAttempt.create({
      data: {
        userId: data.userId,
        studySessionId: data.studySessionId,
        studyTaskId: data.studyTaskId,
        topicId: data.topicId,
        question: data.question,
        difficulty: data.difficulty,
        status: "PENDING",
      },
    });
  }

  async getAttemptById(id: string) {
    return prisma.questionAttempt.findUnique({
      where: { id },
    });
  }

  async getPreviousAttempts(studySessionId: string, topicId: string) {
    return prisma.questionAttempt.findMany({
      where: {
        studySessionId,
        topicId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async updateAttempt(
    id: string,
    data: {
      status?: string;
      userAnswer?: string;
      aiFeedback?: string;
      score?: number;
      submittedAt?: Date;
    }
  ) {
    return prisma.questionAttempt.update({
      where: { id },
      data,
    });
  }
}

export const questionRepository = new QuestionRepository();
