import { db } from "../db/database";
import { questionAttempts, roadmapTopics } from "../db/schema";
import { eq, and, desc, asc } from "drizzle-orm";

export class QuestionRepository {
  async createAttempt(data: {
    userId: string;
    studySessionId: string;
    studyTaskId: string;
    topicId: string;
    question: string;
    difficulty: string;
  }) {
    const result = await db.insert(questionAttempts).values({
      ...data,
      status: "PENDING",
    }).returning();
    return result[0];
  }

  async getAttemptById(id: string) {
    return db.query.questionAttempts.findFirst({
      where: (q, { eq }) => eq(q.id, id),
    });
  }

  async getPreviousAttempts(studySessionId: string, topicId: string) {
    return db.query.questionAttempts.findMany({
      where: (q, { eq, and }) => and(eq(q.studySessionId, studySessionId), eq(q.topicId, topicId)),
      orderBy: (q, { desc }) => [desc(q.createdAt)],
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
    const result = await db.update(questionAttempts)
      .set(data)
      .where(eq(questionAttempts.id, id))
      .returning();
    return result[0];
  }

  async findAttemptsByTopic(topicId: string) {
    return db.query.questionAttempts.findMany({
      where: (q, { eq, and }) => and(eq(q.topicId, topicId), eq(q.status, "SUBMITTED")),
      orderBy: (q, { asc }) => [asc(q.submittedAt)],
    });
  }

  async findAttemptsByUser(userId: string) {
    return db.query.questionAttempts.findMany({
      where: (q, { eq }) => eq(q.userId, userId),
    });
  }

  async findAttemptsBySession(studySessionId: string) {
    return db.query.questionAttempts.findMany({
      where: (q, { eq, and }) => and(eq(q.studySessionId, studySessionId), eq(q.status, "SUBMITTED")),
    });
  }

  async findRecentSubmitted(userId: string, limit: number) {
    return db.query.questionAttempts.findMany({
      where: (q, { eq, and }) => and(eq(q.userId, userId), eq(q.status, "SUBMITTED")),
      orderBy: (q, { desc }) => [desc(q.submittedAt)],
      limit,
      columns: { question: true, overallScore: true, status: true },
    });
  }

  async saveEvaluationTransaction(questionId: string, roadmapTopicId: string, mappedData: any, topicMasteryDelta: number, userAnswer: string, questionType: string, timeTaken: number) {
    return db.transaction(async (tx) => {
      const [attempt] = await tx.update(questionAttempts).set({
        ...mappedData,
        userAnswer,
        questionType,
        timeTaken,
        status: "SUBMITTED",
        submittedAt: new Date(),
      })
      .where(eq(questionAttempts.id, questionId))
      .returning();

      if (topicMasteryDelta !== 0) {
        const topic = await tx.query.roadmapTopics.findFirst({ where: (t, { eq }) => eq(t.id, roadmapTopicId) });
        if (topic) {
          const newMastery = Math.round(Math.min(100, Math.max(0, topic.masteryPercentage + topicMasteryDelta)));
          await tx.update(roadmapTopics).set({ masteryPercentage: newMastery }).where(eq(roadmapTopics.id, roadmapTopicId));
        }
      }

      return attempt;
    });
  }

  async findAttemptsWithTopic(userId: string) {
    return db.query.questionAttempts.findMany({
      where: (q, { eq, and }) => and(eq(q.userId, userId), eq(q.status, "SUBMITTED")),
      orderBy: (q, { desc }) => [desc(q.submittedAt)],
      with: { topic: { columns: { title: true } } },
    });
  }

  async findAttemptWithTopic(userId: string, id: string) {
    return db.query.questionAttempts.findFirst({
      where: (q, { eq }) => eq(q.id, id),
      with: { topic: true },
    });
  }

  async findAttemptsByTopicAndUser(userId: string, topicId: string) {
    return db.query.questionAttempts.findMany({
      where: (q, { eq, and }) => and(eq(q.userId, userId), eq(q.topicId, topicId), eq(q.status, "SUBMITTED")),
    });
  }

  async findAttemptsWithTopicByUser(userId: string) {
    return db.query.questionAttempts.findMany({
      where: (q, { eq, and }) => and(eq(q.userId, userId), eq(q.status, "SUBMITTED")),
      with: {
        topic: {
          with: { module: true },
        },
      },
    });
  }

  async findAttemptsByUserSorted(userId: string) {
    return db.query.questionAttempts.findMany({
      where: (q, { eq, and }) => and(eq(q.userId, userId), eq(q.status, "SUBMITTED")),
      orderBy: (q, { asc }) => [asc(q.submittedAt)],
    });
  }
}

export const questionRepository = new QuestionRepository();
