import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { users } from './user';
import { studySessions, questionAttempts, studyTasks } from './study';

export const roadmaps = pgTable('Roadmap', {
  id: text('id').primaryKey().$defaultFn(() => uuidv4()),
  userId: text('userId').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  targetRole: text('targetRole').notNull(),
  currentLevel: text('currentLevel').notNull(),
  estimatedWeeks: integer('estimatedWeeks').notNull(),
  status: text('status').default('ACTIVE').notNull(),
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 }).defaultNow().$onUpdate(() => new Date()).notNull(),
});

export const roadmapModules = pgTable('RoadmapModule', {
  id: text('id').primaryKey().$defaultFn(() => uuidv4()),
  roadmapId: text('roadmapId').notNull().references(() => roadmaps.id, { onDelete: 'cascade' }),
  order: integer('order').notNull(),
  category: text('category').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  estimatedHours: integer('estimatedHours').notNull(),
  difficulty: text('difficulty').default('Beginner').notNull(),
  status: text('status').default('PENDING').notNull(),
});

export const roadmapTopics = pgTable('RoadmapTopic', {
  id: text('id').primaryKey().$defaultFn(() => uuidv4()),
  moduleId: text('moduleId').notNull().references(() => roadmapModules.id, { onDelete: 'cascade' }),
  order: integer('order').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  estimatedMinutes: integer('estimatedMinutes').notNull(),
  status: text('status').default('PENDING').notNull(),
  masteryPercentage: integer('masteryPercentage').default(0).notNull(),
  
  nextReviewDate: timestamp('nextReviewDate', { mode: 'date', precision: 3 }),
  lastAttemptDate: timestamp('lastAttemptDate', { mode: 'date', precision: 3 }),
});

export const roadmapsRelations = relations(roadmaps, ({ one, many }) => ({
  user: one(users, {
    fields: [roadmaps.userId],
    references: [users.id],
  }),
  modules: many(roadmapModules),
  studySessions: many(studySessions),
}));

export const roadmapModulesRelations = relations(roadmapModules, ({ one, many }) => ({
  roadmap: one(roadmaps, {
    fields: [roadmapModules.roadmapId],
    references: [roadmaps.id],
  }),
  topics: many(roadmapTopics),
  studySessions: many(studySessions),
}));

export const roadmapTopicsRelations = relations(roadmapTopics, ({ one, many }) => ({
  module: one(roadmapModules, {
    fields: [roadmapTopics.moduleId],
    references: [roadmapModules.id],
  }),
  studyTasks: many(studyTasks),
  questionAttempts: many(questionAttempts),
}));
