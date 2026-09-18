import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { users } from './user';

export const resumes = pgTable('Resume', {
  id: text('id').primaryKey().$defaultFn(() => uuidv4()),
  userId: text('userId').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  
  originalFileName: text('originalFileName').notNull(),
  storedFileName: text('storedFileName').notNull(),
  mimeType: text('mimeType').notNull(),
  fileSize: integer('fileSize').notNull(),
  pageCount: integer('pageCount'),
  
  extractedText: text('extractedText'),
  
  name: text('name'),
  email: text('email'),
  phone: text('phone'),
  
  skills: text('skills'),
  education: text('education'),
  experience: text('experience'),
  projects: text('projects'),
  
  aiSummary: text('aiSummary'),
  strengths: text('strengths'),
  weaknesses: text('weaknesses'),
  suggestedSkills: text('suggestedSkills'),
  analysisVersion: text('analysisVersion'),
  analyzedAt: timestamp('analyzedAt', { mode: 'date', precision: 3 }),
  
  status: text('status').default('UPLOADED').notNull(),
  
  parseVersion: text('parseVersion'),
  parseStatus: text('parseStatus'),
  parseError: text('parseError'),
  
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 }).defaultNow().$onUpdate(() => new Date()).notNull(),
});

export const resumesRelations = relations(resumes, ({ one }) => ({
  user: one(users, {
    fields: [resumes.userId],
    references: [users.id],
  }),
}));
