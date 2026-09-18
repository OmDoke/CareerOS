import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { v4 as uuidv4 } from 'uuid';

export const schedulerLogs = pgTable('SchedulerLog', {
  id: text('id').primaryKey().$defaultFn(() => uuidv4()),
  jobName: text('jobName').notNull(),
  status: text('status').notNull(),
  durationMs: integer('durationMs').notNull(),
  usersProcessed: integer('usersProcessed').notNull(),
  messagesSent: integer('messagesSent').notNull(),
  error: text('error'),
  startedAt: timestamp('startedAt', { mode: 'date', precision: 3 }).defaultNow().notNull(),
  completedAt: timestamp('completedAt', { mode: 'date', precision: 3 }).defaultNow().notNull(),
});
