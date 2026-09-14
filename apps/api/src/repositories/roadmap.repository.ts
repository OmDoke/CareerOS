import { prisma } from "../database";

export const roadmapRepository = {
  async create(userId: string, roadmapData: any) {
    return prisma.roadmap.create({
      data: {
        userId,
        title: roadmapData.title,
        targetRole: roadmapData.targetRole,
        currentLevel: roadmapData.currentLevel,
        estimatedWeeks: roadmapData.estimatedWeeks,
        modules: {
          create: roadmapData.modules.map((mod: any) => ({
            order: mod.order,
            category: mod.category,
            title: mod.title,
            description: mod.description,
            estimatedHours: mod.estimatedHours,
            difficulty: mod.difficulty,
            topics: {
              create: mod.topics.map((topic: any) => ({
                order: topic.order,
                title: topic.title,
                description: topic.description,
                estimatedMinutes: topic.estimatedMinutes,
              })),
            },
          })),
        },
      },
      include: {
        modules: {
          include: {
            topics: true,
          },
        },
      },
    });
  },

  async findByUserId(userId: string) {
    return prisma.roadmap.findUnique({
      where: { userId },
      include: {
        modules: {
          include: {
            topics: true,
          },
          orderBy: { order: "asc" },
        },
      },
    });
  },

  async findById(id: string) {
    return prisma.roadmap.findUnique({
      where: { id },
      include: {
        modules: {
          include: {
            topics: true,
          },
          orderBy: { order: "asc" },
        },
      },
    });
  },

  async deleteByUserId(userId: string) {
    return prisma.roadmap.delete({
      where: { userId },
    });
  },

  async exists(userId: string) {
    const count = await prisma.roadmap.count({
      where: { userId },
    });
    return count > 0;
  },
};
