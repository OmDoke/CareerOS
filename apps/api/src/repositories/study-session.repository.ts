import { db } from "../db/database";
import { studySessions, studyTasks, roadmapTopics } from "../db/schema";
import { eq, and, gte, lte, inArray, desc } from "drizzle-orm";

export const studySessionRepository = {
  async create(userId: string, roadmapId: string, currentModuleId: string, estimatedMinutes: string | number, totalQuestions: string | number, tasks: any[]) {
    return db.transaction(async (tx) => {
      const [session] = await tx.insert(studySessions).values({
        userId,
        roadmapId,
        currentModuleId,
        estimatedMinutes: Number(estimatedMinutes),
        totalQuestions: Number(totalQuestions),
      }).returning();

      if (tasks && tasks.length > 0) {
        const tasksToInsert = tasks.map((task) => ({
          sessionId: session.id,
          topicId: task.topicId,
          order: task.order,
          title: task.title,
          estimatedMinutes: Number(task.estimatedMinutes),
        }));
        await tx.insert(studyTasks).values(tasksToInsert);
      }

      return tx.query.studySessions.findFirst({
        where: (s, { eq }) => eq(s.id, session.id),
        with: {
          tasks: {
            with: { topic: true },
          },
          currentModule: true,
        },
      });
    });
  },

  async findTodaySession(userId: string) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    return db.query.studySessions.findFirst({
      where: (s, { eq, and, gte, lte }) => and(
        eq(s.userId, userId),
        gte(s.sessionDate, todayStart),
        lte(s.sessionDate, todayEnd)
      ),
      with: {
        tasks: {
          orderBy: (t, { asc }) => [asc(t.order)],
          with: { topic: true },
        },
        currentModule: true,
      },
    });
  },

  async findHistory(userId: string) {
    return db.query.studySessions.findMany({
      where: (s, { eq }) => eq(s.userId, userId),
      orderBy: (s, { desc }) => [desc(s.sessionDate)],
      with: {
        currentModule: true,
      },
    });
  },

  async findById(id: string) {
    return db.query.studySessions.findFirst({
      where: (s, { eq }) => eq(s.id, id),
      with: {
        tasks: true,
      },
    });
  },

  async completeSession(id: string) {
    return db.transaction(async (tx) => {
      const [session] = await tx.update(studySessions)
        .set({ status: "COMPLETED" })
        .where(eq(studySessions.id, id))
        .returning();

      const tasks = await tx.query.studyTasks.findMany({
        where: (t, { eq }) => eq(t.sessionId, id),
      });

      const topicIds = tasks.map((t) => t.topicId);
      if (topicIds.length > 0) {
        await tx.update(roadmapTopics)
          .set({ status: "COMPLETED" })
          .where(inArray(roadmapTopics.id, topicIds));
          
        await tx.update(studyTasks)
          .set({ status: "COMPLETED" })
          .where(eq(studyTasks.sessionId, id));
      }

      return tx.query.studySessions.findFirst({
        where: (s, { eq }) => eq(s.id, id),
        with: { tasks: true },
      });
    });
  },

  async findTaskById(taskId: string, sessionId: string) {
    return db.query.studyTasks.findFirst({
      where: (t, { eq, and }) => and(eq(t.id, taskId), eq(t.sessionId, sessionId)),
      with: {
        topic: {
          with: {
            module: {
              with: {
                roadmap: true,
              },
            },
          },
        },
      },
    });
  }
};
