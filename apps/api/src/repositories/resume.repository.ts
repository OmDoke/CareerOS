import { db } from "../db/database";
import { resumes } from "../db/schema";
import { eq, count } from "drizzle-orm";

export class ResumeRepository {
  async create(data: any) {
    const result = await db.insert(resumes).values(data).returning();
    return result[0];
  }

  async findByUserId(userId: string) {
    return db.query.resumes.findFirst({
      where: (r, { eq }) => eq(r.userId, userId),
    });
  }

  async update(userId: string, data: any) {
    const result = await db.update(resumes)
      .set(data)
      .where(eq(resumes.userId, userId))
      .returning();
    return result[0];
  }

  async delete(userId: string) {
    const result = await db.delete(resumes)
      .where(eq(resumes.userId, userId))
      .returning();
    return result[0];
  }

  async exists(userId: string) {
    const result = await db.select({ value: count() }).from(resumes).where(eq(resumes.userId, userId));
    return result[0].value > 0;
  }
}

export const resumeRepository = new ResumeRepository();
