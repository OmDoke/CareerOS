import { pgTable, text, boolean, integer, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { resumes } from './resume';
import { roadmaps } from './roadmap';
import { studySessions, questionAttempts } from './study';
import { notificationSettings, notificationLogs } from './notification';
import { telegramConnections } from './telegram';
import { aiProviderSettings } from './ai-provider';

export const users = pgTable('User', {
  id: text('id').primaryKey().$defaultFn(() => uuidv4()),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  firstName: text('firstName'),
  lastName: text('lastName'),
  avatar: text('avatar'),
  role: text('role').default('USER').notNull(),
  isEmailVerified: boolean('isEmailVerified').default(false).notNull(),
  
  currentStreak: integer('currentStreak').default(0).notNull(),
  longestStreak: integer('longestStreak').default(0).notNull(),
  lastStudyDate: timestamp('lastStudyDate', { mode: 'date', precision: 3 }),

  telegramChatId: text('telegramChatId').unique(),
  telegramUsername: text('telegramUsername'),
  telegramConnected: boolean('telegramConnected').default(false).notNull(),
  telegramConnectedAt: timestamp('telegramConnectedAt', { mode: 'date', precision: 3 }),

  // Integrations: Naukri Auto-Updater
  naukriUsername: text('naukriUsername'),
  naukriPassword: text('naukriPassword'), // Store encrypted in a real prod env
  naukriSummary: text('naukriSummary'),
  naukriState: boolean('naukriState').default(false).notNull(), // Replaces local .naukristate file

  // Integrations: Job Scraper
  jobScraperUrl: text('jobScraperUrl'),
  jobScraperLocation: text('jobScraperLocation'),

  // Integrations: RapidAPI Job Scraper
  rapidApiUrl: text('rapidApiUrl'),
  rapidApiKey: text('rapidApiKey'),
  rapidApiHost: text('rapidApiHost'),

  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 }).$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 }).$defaultFn(() => new Date()).$onUpdate(() => new Date()).notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  resume: one(resumes),
  roadmap: one(roadmaps),
  studySessions: many(studySessions),
  questionAttempts: many(questionAttempts),
  notificationSettings: one(notificationSettings),
  notificationLogs: many(notificationLogs),
  telegramConnections: many(telegramConnections),
  aiProviderSettings: one(aiProviderSettings),
}));
