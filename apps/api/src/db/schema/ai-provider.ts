import { pgTable, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { users } from './user';

export const aiProviderSettings = pgTable('AIProviderSettings', {
  id: text('id').primaryKey().$defaultFn(() => uuidv4()),
  userId: text('userId').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  provider: text('provider').default('GEMINI').notNull(),
  encryptedApiKey: text('encryptedApiKey').notNull(),
  selectedModel: text('selectedModel'),
  isConnected: boolean('isConnected').default(false).notNull(),
  lastValidated: timestamp('lastValidated', { mode: 'date', precision: 3 }),
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 }).defaultNow().$onUpdate(() => new Date()).notNull(),
});

export const aiProviderSettingsRelations = relations(aiProviderSettings, ({ one }) => ({
  user: one(users, {
    fields: [aiProviderSettings.userId],
    references: [users.id],
  }),
}));
