import { db } from "../db/database";
import { roadmaps, roadmapModules, roadmapTopics } from "../db/schema";
import { eq, and, count, lt } from "drizzle-orm";

export const roadmapRepository = {
  async create(userId: string, roadmapData: any) {
    return db.transaction(async (tx) => {
      const [roadmap] = await tx.insert(roadmaps).values({
        userId,
        title: roadmapData.title,
        targetRole: roadmapData.targetRole,
        currentLevel: roadmapData.currentLevel,
        estimatedWeeks: roadmapData.estimatedWeeks,
      }).returning();

      for (const mod of roadmapData.modules) {
        const [module] = await tx.insert(roadmapModules).values({
          roadmapId: roadmap.id,
          order: mod.order,
          category: mod.category,
          title: mod.title,
          description: mod.description,
          estimatedHours: mod.estimatedHours,
          difficulty: mod.difficulty,
        }).returning();

        if (mod.topics && mod.topics.length > 0) {
          const topicsToInsert = mod.topics.map((topic: any) => ({
            moduleId: module.id,
            order: topic.order,
            title: topic.title,
            description: topic.description,
            estimatedMinutes: topic.estimatedMinutes,
          }));
          await tx.insert(roadmapTopics).values(topicsToInsert);
        }
      }

      return tx.query.roadmaps.findFirst({
        where: (r, { eq }) => eq(r.id, roadmap.id),
        with: {
          modules: {
            orderBy: (m, { asc }) => [asc(m.order)],
            with: {
              topics: {
                orderBy: (t, { asc }) => [asc(t.order)]
              },
            },
          },
        },
      });
    });
  },

  async findByUserId(userId: string) {
    return db.query.roadmaps.findFirst({
      where: (r, { eq }) => eq(r.userId, userId),
      with: {
        modules: {
          orderBy: (m, { asc }) => [asc(m.order)],
          with: {
            topics: {
              orderBy: (t, { asc }) => [asc(t.order)]
            },
          },
        },
      },
    });
  },

  async findById(id: string) {
    return db.query.roadmaps.findFirst({
      where: (r, { eq }) => eq(r.id, id),
      with: {
        modules: {
          orderBy: (m, { asc }) => [asc(m.order)],
          with: {
            topics: {
              orderBy: (t, { asc }) => [asc(t.order)]
            },
          },
        },
      },
    });
  },

  async deleteByUserId(userId: string) {
    return db.delete(roadmaps).where(eq(roadmaps.userId, userId));
  },

  async exists(userId: string) {
    const result = await db.select({ value: count() }).from(roadmaps).where(eq(roadmaps.userId, userId));
    return result[0].value > 0;
  },

  async updateTopic(topicId: string, data: any) {
    return db.update(roadmapTopics).set(data).where(eq(roadmapTopics.id, topicId)).returning();
  },

  async findTopicsBefore(moduleId: string, order: number) {
    return db.query.roadmapTopics.findMany({
      where: (t, { eq, and, lt }) => and(eq(t.moduleId, moduleId), lt(t.order, order)),
    });
  },

  async findTopicById(topicId: string) {
    return db.query.roadmapTopics.findFirst({
      where: (t, { eq }) => eq(t.id, topicId),
    });
  }
};
