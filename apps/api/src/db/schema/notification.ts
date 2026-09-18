import { pgTable, text, boolean, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { users } from './user';

export const notificationSettings = pgTable('NotificationSettings', {
  id: text('id').primaryKey().$defaultFn(() => uuidv4()),
  userId: text('userId').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  
  telegramEnabled: boolean('telegramEnabled').default(true).notNull(),
  reminderTime: text('reminderTime').default('09:00').notNull(),
  timezone: text('timezone').default('UTC').notNull(),
  
  weeklyReport: boolean('weeklyReport').default(true).notNull(),
  motivationMessages: boolean('motivationMessages').default(true).notNull(),
  practiceReminder: boolean('practiceReminder').default(true).notNull(),
  reviewReminder: boolean('reviewReminder').default(true).notNull(),
  studyReminder: boolean('studyReminder').default(true).notNull(),
  
  quietHoursStart: text('quietHoursStart'),
  quietHoursEnd: text('quietHoursEnd'),
  
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 }).defaultNow().$onUpdate(() => new Date()).notNull(),
});

export const notificationSettingsRelations = relations(notificationSettings, ({ one }) => ({
  user: one(users, {
    fields: [notificationSettings.userId],
    references: [users.id],
  }),
}));

export const notificationLogs = pgTable('NotificationLog', {
  id: text('id').primaryKey().$defaultFn(() => uuidv4()),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  message: text('message').notNull(),
  status: text('status').default('PENDING').notNull(),
  error: text('error'),
  retries: integer('retries').default(0).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 }).defaultNow().$onUpdate(() => new Date()).notNull(),
});

export const notificationLogsRelations = relations(notificationLogs, ({ one }) => ({
  user: one(users, {
    fields: [notificationLogs.userId],
    references: [users.id],
  }),
}));
