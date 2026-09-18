import { db } from "../db/database";
import { telegramConnections } from "../db/schema";
import { eq } from "drizzle-orm";

export class TelegramRepository {
  async findConnectionByToken(token: string) {
    return db.query.telegramConnections.findFirst({
      where: (tc, { eq }) => eq(tc.token, token),
      with: { user: true },
    });
  }

  async updateConnection(id: string, data: any) {
    return db.update(telegramConnections)
      .set(data)
      .where(eq(telegramConnections.id, id))
      .returning();
  }

  async createConnection(data: any) {
    const result = await db.insert(telegramConnections).values(data).returning();
    return result[0];
  }
}

export const telegramRepository = new TelegramRepository();
