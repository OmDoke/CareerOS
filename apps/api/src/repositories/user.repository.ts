import { db } from "../db/database";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export class UserRepository {
  async create(data: any) {
    const result = await db.insert(users).values(data).returning();
    return result[0];
  }

  async findByEmail(email: string) {
    return db.query.users.findFirst({
      where: (u, { eq }) => eq(u.email, email),
    });
  }

  async findById(id: string) {
    return db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, id),
    });
  }

  async findByTelegramId(telegramChatId: string) {
    return db.query.users.findFirst({
      where: (u, { eq }) => eq(u.telegramChatId, telegramChatId),
    });
  }

  async findAuthUserById(id: string) {
    return db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, id),
      columns: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
      }
    });
  }

  async update(id: string, data: any) {
    const result = await db.update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async findByIdWithRoadmap(id: string) {
    return db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, id),
      with: { roadmap: true },
    });
  }

  async findByIdWithRoadmapAndResume(id: string) {
    return db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, id),
      with: {
        resume: true,
        roadmap: {
          with: {
            modules: {
              with: {
                topics: true,
              },
            },
          },
        },
      },
    });
  }
}

export const userRepository = new UserRepository();
