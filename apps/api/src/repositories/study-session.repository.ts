import { prisma } from "../database";

export const studySessionRepository = {
  async create(userId: string, roadmapId: string, currentModuleId: string, estimatedMinutes: string | number, totalQuestions: string | number, tasks: any[]) {
    return prisma.studySession.create({
      data: {
        userId,
        roadmapId,
        currentModuleId,
        estimatedMinutes: Number(estimatedMinutes),
        totalQuestions: Number(totalQuestions),
        tasks: {
          create: tasks.map(task => ({
            topicId: task.topicId,
            order: task.order,
            title: task.title,
            estimatedMinutes: Number(task.estimatedMinutes),
          })),
        },
      },
      include: {
        tasks: {
          include: {
            topic: true,
          },
        },
        currentModule: true,
      },
    });
  },

  async findTodaySession(userId: string) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    return prisma.studySession.findFirst({
      where: {
        userId,
        sessionDate: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      include: {
        tasks: {
          include: {
            topic: true,
          },
          orderBy: {
            order: "asc",
          },
        },
        currentModule: true,
      },
    });
  },

  async findHistory(userId: string) {
    return prisma.studySession.findMany({
      where: { userId },
      orderBy: { sessionDate: "desc" },
      include: {
        currentModule: true,
      },
    });
  },

  async findById(id: string) {
    return prisma.studySession.findUnique({
      where: { id },
      include: {
        tasks: true,
      },
    });
  },

  async completeSession(id: string) {
    // First complete the session
    const session = await prisma.studySession.update({
      where: { id },
      data: { status: "COMPLETED" },
      include: { tasks: true },
    });

    // Mark all topics as completed in the roadmap
    const topicIds = session.tasks.map(t => t.topicId);
    if (topicIds.length > 0) {
      await prisma.roadmapTopic.updateMany({
        where: { id: { in: topicIds } },
        data: { status: "COMPLETED" },
      });
      await prisma.studyTask.updateMany({
        where: { sessionId: id },
        data: { status: "COMPLETED" },
      });
    }

    return session;
  },
};
