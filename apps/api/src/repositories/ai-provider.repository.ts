import { db } from "../db/database";
import { aiProviderSettings } from "../db/schema";
import { eq } from "drizzle-orm";

export class AIProviderRepository {
  async findByUserId(userId: string) {
    return db.query.aiProviderSettings.findFirst({
      where: (s, { eq }) => eq(s.userId, userId),
    });
  }

  async upsert(userId: string, updateData: any, createData: any) {
    const result = await db.insert(aiProviderSettings)
      .values(createData)
      .onConflictDoUpdate({
        target: aiProviderSettings.userId,
        set: updateData,
      })
      .returning();
    return result[0];
  }

  async deleteByUserId(userId: string) {
    const result = await db.delete(aiProviderSettings)
      .where(eq(aiProviderSettings.userId, userId))
      .returning();
    return result[0];
  }

  async updateByUserId(userId: string, data: any) {
    const result = await db.update(aiProviderSettings)
      .set(data)
      .where(eq(aiProviderSettings.userId, userId))
      .returning();
    return result[0];
  }
}

export const aiProviderRepository = new AIProviderRepository();
