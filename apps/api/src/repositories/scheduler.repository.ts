import { db } from "../db/database";
import { schedulerLogs } from "../db/schema";

export class SchedulerRepository {
  async createLog(data: any) {
    const result = await db.insert(schedulerLogs).values(data).returning();
    return result[0];
  }
}

export const schedulerRepository = new SchedulerRepository();
