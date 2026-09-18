import { pgTable, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { users } from './user';

export const telegramConnections = pgTable('TelegramConnection', {
  id: text('id').primaryKey().$defaultFn(() => uuidv4()),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expiresAt', { mode: 'date', precision: 3 }).notNull(),
  used: boolean('used').default(false).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 }).defaultNow().notNull(),
});

export const telegramConnectionsRelations = relations(telegramConnections, ({ one }) => ({
  user: one(users, {
    fields: [telegramConnections.userId],
    references: [users.id],
  }),
}));
