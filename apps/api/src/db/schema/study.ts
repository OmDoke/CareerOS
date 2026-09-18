import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { users } from './user';
import { roadmaps, roadmapModules, roadmapTopics } from './roadmap';

export const studySessions = pgTable('StudySession', {
  id: text('id').primaryKey().$defaultFn(() => uuidv4()),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  roadmapId: text('roadmapId').notNull().references(() => roadmaps.id, { onDelete: 'cascade' }),
  currentModuleId: text('currentModuleId').notNull().references(() => roadmapModules.id, { onDelete: 'cascade' }),
  sessionDate: timestamp('sessionDate', { mode: 'date', precision: 3 }).defaultNow().notNull(),
  estimatedMinutes: integer('estimatedMinutes').default(0).notNull(),
  totalQuestions: integer('totalQuestions').default(0).notNull(),
  completedQuestions: integer('completedQuestions').default(0).notNull(),
  status: text('status').default('PENDING').notNull(),
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 }).defaultNow().$onUpdate(() => new Date()).notNull(),
});

export const studyTasks = pgTable('StudyTask', {
  id: text('id').primaryKey().$defaultFn(() => uuidv4()),
  sessionId: text('sessionId').notNull().references(() => studySessions.id, { onDelete: 'cascade' }),
  topicId: text('topicId').notNull().references(() => roadmapTopics.id, { onDelete: 'cascade' }),
  order: integer('order').notNull(),
  title: text('title').notNull(),
  estimatedMinutes: integer('estimatedMinutes').notNull(),
  status: text('status').default('PENDING').notNull(),
});

export const questionAttempts = pgTable('QuestionAttempt', {
  id: text('id').primaryKey().$defaultFn(() => uuidv4()),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  studySessionId: text('studySessionId').notNull().references(() => studySessions.id, { onDelete: 'cascade' }),
  studyTaskId: text('studyTaskId').notNull().references(() => studyTasks.id, { onDelete: 'cascade' }),
  topicId: text('topicId').notNull().references(() => roadmapTopics.id, { onDelete: 'cascade' }),
  
  question: text('question').notNull(),
  questionType: text('questionType'),
  difficulty: text('difficulty').default('Beginner').notNull(),
  userAnswer: text('userAnswer'),
  
  overallScore: integer('overallScore'),
  technicalScore: integer('technicalScore'),
  problemSolvingScore: integer('problemSolvingScore'),
  communicationScore: integer('communicationScore'),
  timeComplexityScore: integer('timeComplexityScore'),
  spaceComplexityScore: integer('spaceComplexityScore'),
  confidenceScore: integer('confidenceScore'),
  
  feedback: text('feedback'),
  strengths: text('strengths'),
  mistakes: text('mistakes'),
  missingConcepts: text('missingConcepts'),
  correctAnswer: text('correctAnswer'),
  optimizedAnswer: text('optimizedAnswer'),
  resources: text('resources'),
  followUpQuestions: text('followUpQuestions'),
  hintCount: integer('hintCount').default(0).notNull(),
  skipCount: integer('skipCount').default(0).notNull(),
  
  evaluationJson: text('evaluationJson'),
  evaluationModel: text('evaluationModel'),
  tokensUsed: integer('tokensUsed'),
  timeTaken: integer('timeTaken'),
  evaluatedAt: timestamp('evaluatedAt', { mode: 'date', precision: 3 }),
  
  status: text('status').default('PENDING').notNull(),
  
  startedAt: timestamp('startedAt', { mode: 'date', precision: 3 }).defaultNow().notNull(),
  submittedAt: timestamp('submittedAt', { mode: 'date', precision: 3 }),
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 }).defaultNow().notNull(),
});

export const studySessionsRelations = relations(studySessions, ({ one, many }) => ({
  user: one(users, {
    fields: [studySessions.userId],
    references: [users.id],
  }),
  roadmap: one(roadmaps, {
    fields: [studySessions.roadmapId],
    references: [roadmaps.id],
  }),
  currentModule: one(roadmapModules, {
    fields: [studySessions.currentModuleId],
    references: [roadmapModules.id],
  }),
  tasks: many(studyTasks),
  questionAttempts: many(questionAttempts),
}));

export const studyTasksRelations = relations(studyTasks, ({ one, many }) => ({
  session: one(studySessions, {
    fields: [studyTasks.sessionId],
    references: [studySessions.id],
  }),
  topic: one(roadmapTopics, {
    fields: [studyTasks.topicId],
    references: [roadmapTopics.id],
  }),
  questionAttempts: many(questionAttempts),
}));

export const questionAttemptsRelations = relations(questionAttempts, ({ one }) => ({
  user: one(users, {
    fields: [questionAttempts.userId],
    references: [users.id],
  }),
  session: one(studySessions, {
    fields: [questionAttempts.studySessionId],
    references: [studySessions.id],
  }),
  task: one(studyTasks, {
    fields: [questionAttempts.studyTaskId],
    references: [studyTasks.id],
  }),
  topic: one(roadmapTopics, {
    fields: [questionAttempts.topicId],
    references: [roadmapTopics.id],
  }),
}));
