import { db } from "../db/database";
import { notificationSettings, notificationLogs, users } from "../db/schema";
import { eq, and, desc, gte, like, isNotNull } from "drizzle-orm";

export class NotificationRepository {
  async findSettingsByUserId(userId: string) {
    return db.query.notificationSettings.findFirst({
      where: (s, { eq }) => eq(s.userId, userId),
    });
  }

  async getSettingsByUserId(userId: string) {
    return this.findSettingsByUserId(userId);
  }

  async createSettings(data: any) {
    const now = new Date();
    const result = await db.insert(notificationSettings).values({
      ...data,
      createdAt: data.createdAt || now,
      updatedAt: data.updatedAt || now,
    }).returning();
    return result[0];
  }

  async upsertSettings(userId: string, updateData: any, createData: any) {
    const result = await db.insert(notificationSettings)
      .values(createData)
      .onConflictDoUpdate({
        target: notificationSettings.userId,
        set: updateData,
      })
      .returning();
    return result[0];
  }

  async findLogsByUserId(userId: string, limit: number = 50) {
    return db.query.notificationLogs.findMany({
      where: (l, { eq }) => eq(l.userId, userId),
      orderBy: (l, { desc }) => [desc(l.createdAt)],
      limit,
    });
  }

  async createLog(data: any) {
    const result = await db.insert(notificationLogs).values(data).returning();
    return result[0];
  }

  async findRecentLog(userId: string, type: string, since: Date) {
    return db.query.notificationLogs.findFirst({
      where: (l, { eq, and, gte }) => and(
        eq(l.userId, userId),
        eq(l.type, type),
        gte(l.createdAt, since)
      ),
    });
  }
  
  async findSettingsForHourlyReminders(hourStr: string) {
    return db.select({
      setting: notificationSettings,
      user: users
    })
    .from(notificationSettings)
    .innerJoin(users, eq(notificationSettings.userId, users.id))
    .where(
      and(
        eq(notificationSettings.telegramEnabled, true),
        like(notificationSettings.reminderTime, `${hourStr}%`),
        eq(users.telegramConnected, true),
        isNotNull(users.telegramChatId)
      )
    )
    .then(rows => rows.map(row => ({
      ...row.setting,
      user: row.user
    })));
  }
}

export const notificationRepository = new NotificationRepository();
