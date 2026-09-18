CREATE TABLE "User" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"firstName" text,
	"lastName" text,
	"avatar" text,
	"role" text DEFAULT 'USER' NOT NULL,
	"isEmailVerified" boolean DEFAULT false NOT NULL,
	"currentStreak" integer DEFAULT 0 NOT NULL,
	"longestStreak" integer DEFAULT 0 NOT NULL,
	"lastStudyDate" timestamp (3),
	"telegramChatId" text,
	"telegramUsername" text,
	"telegramConnected" boolean DEFAULT false NOT NULL,
	"telegramConnectedAt" timestamp (3),
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL,
	CONSTRAINT "User_email_unique" UNIQUE("email"),
	CONSTRAINT "User_telegramChatId_unique" UNIQUE("telegramChatId")
);
--> statement-breakpoint
CREATE TABLE "NotificationLog" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"message" text NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"error" text,
	"retries" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "NotificationSettings" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"telegramEnabled" boolean DEFAULT true NOT NULL,
	"reminderTime" text DEFAULT '09:00' NOT NULL,
	"timezone" text DEFAULT 'UTC' NOT NULL,
	"weeklyReport" boolean DEFAULT true NOT NULL,
	"motivationMessages" boolean DEFAULT true NOT NULL,
	"practiceReminder" boolean DEFAULT true NOT NULL,
	"reviewReminder" boolean DEFAULT true NOT NULL,
	"studyReminder" boolean DEFAULT true NOT NULL,
	"quietHoursStart" text,
	"quietHoursEnd" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL,
	CONSTRAINT "NotificationSettings_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "TelegramConnection" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"token" text NOT NULL,
	"expiresAt" timestamp (3) NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	CONSTRAINT "TelegramConnection_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "SchedulerLog" (
	"id" text PRIMARY KEY NOT NULL,
	"jobName" text NOT NULL,
	"status" text NOT NULL,
	"durationMs" integer NOT NULL,
	"usersProcessed" integer NOT NULL,
	"messagesSent" integer NOT NULL,
	"error" text,
	"startedAt" timestamp (3) DEFAULT now() NOT NULL,
	"completedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "AIProviderSettings" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"provider" text DEFAULT 'GEMINI' NOT NULL,
	"encryptedApiKey" text NOT NULL,
	"selectedModel" text,
	"isConnected" boolean DEFAULT false NOT NULL,
	"lastValidated" timestamp (3),
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL,
	CONSTRAINT "AIProviderSettings_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "Resume" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"originalFileName" text NOT NULL,
	"storedFileName" text NOT NULL,
	"mimeType" text NOT NULL,
	"fileSize" integer NOT NULL,
	"pageCount" integer,
	"extractedText" text,
	"name" text,
	"email" text,
	"phone" text,
	"skills" text,
	"education" text,
	"experience" text,
	"projects" text,
	"aiSummary" text,
	"strengths" text,
	"weaknesses" text,
	"suggestedSkills" text,
	"analysisVersion" text,
	"analyzedAt" timestamp (3),
	"status" text DEFAULT 'UPLOADED' NOT NULL,
	"parseVersion" text,
	"parseStatus" text,
	"parseError" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL,
	CONSTRAINT "Resume_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "RoadmapModule" (
	"id" text PRIMARY KEY NOT NULL,
	"roadmapId" text NOT NULL,
	"order" integer NOT NULL,
	"category" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"estimatedHours" integer NOT NULL,
	"difficulty" text DEFAULT 'Beginner' NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "RoadmapTopic" (
	"id" text PRIMARY KEY NOT NULL,
	"moduleId" text NOT NULL,
	"order" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"estimatedMinutes" integer NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"masteryPercentage" integer DEFAULT 0 NOT NULL,
	"nextReviewDate" timestamp (3),
	"lastAttemptDate" timestamp (3)
);
--> statement-breakpoint
CREATE TABLE "Roadmap" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"title" text NOT NULL,
	"targetRole" text NOT NULL,
	"currentLevel" text NOT NULL,
	"estimatedWeeks" integer NOT NULL,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL,
	CONSTRAINT "Roadmap_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "QuestionAttempt" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"studySessionId" text NOT NULL,
	"studyTaskId" text NOT NULL,
	"topicId" text NOT NULL,
	"question" text NOT NULL,
	"questionType" text,
	"difficulty" text DEFAULT 'Beginner' NOT NULL,
	"userAnswer" text,
	"overallScore" integer,
	"technicalScore" integer,
	"problemSolvingScore" integer,
	"communicationScore" integer,
	"timeComplexityScore" integer,
	"spaceComplexityScore" integer,
	"confidenceScore" integer,
	"feedback" text,
	"strengths" text,
	"mistakes" text,
	"missingConcepts" text,
	"correctAnswer" text,
	"optimizedAnswer" text,
	"resources" text,
	"followUpQuestions" text,
	"hintCount" integer DEFAULT 0 NOT NULL,
	"skipCount" integer DEFAULT 0 NOT NULL,
	"evaluationJson" text,
	"evaluationModel" text,
	"tokensUsed" integer,
	"timeTaken" integer,
	"evaluatedAt" timestamp (3),
	"status" text DEFAULT 'PENDING' NOT NULL,
	"startedAt" timestamp (3) DEFAULT now() NOT NULL,
	"submittedAt" timestamp (3),
	"createdAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "StudySession" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"roadmapId" text NOT NULL,
	"currentModuleId" text NOT NULL,
	"sessionDate" timestamp (3) DEFAULT now() NOT NULL,
	"estimatedMinutes" integer DEFAULT 0 NOT NULL,
	"totalQuestions" integer DEFAULT 0 NOT NULL,
	"completedQuestions" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "StudyTask" (
	"id" text PRIMARY KEY NOT NULL,
	"sessionId" text NOT NULL,
	"topicId" text NOT NULL,
	"order" integer NOT NULL,
	"title" text NOT NULL,
	"estimatedMinutes" integer NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "NotificationLog" ADD CONSTRAINT "NotificationLog_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "NotificationSettings" ADD CONSTRAINT "NotificationSettings_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "TelegramConnection" ADD CONSTRAINT "TelegramConnection_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "AIProviderSettings" ADD CONSTRAINT "AIProviderSettings_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "RoadmapModule" ADD CONSTRAINT "RoadmapModule_roadmapId_Roadmap_id_fk" FOREIGN KEY ("roadmapId") REFERENCES "public"."Roadmap"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "RoadmapTopic" ADD CONSTRAINT "RoadmapTopic_moduleId_RoadmapModule_id_fk" FOREIGN KEY ("moduleId") REFERENCES "public"."RoadmapModule"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Roadmap" ADD CONSTRAINT "Roadmap_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "QuestionAttempt" ADD CONSTRAINT "QuestionAttempt_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "QuestionAttempt" ADD CONSTRAINT "QuestionAttempt_studySessionId_StudySession_id_fk" FOREIGN KEY ("studySessionId") REFERENCES "public"."StudySession"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "QuestionAttempt" ADD CONSTRAINT "QuestionAttempt_studyTaskId_StudyTask_id_fk" FOREIGN KEY ("studyTaskId") REFERENCES "public"."StudyTask"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "QuestionAttempt" ADD CONSTRAINT "QuestionAttempt_topicId_RoadmapTopic_id_fk" FOREIGN KEY ("topicId") REFERENCES "public"."RoadmapTopic"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "StudySession" ADD CONSTRAINT "StudySession_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "StudySession" ADD CONSTRAINT "StudySession_roadmapId_Roadmap_id_fk" FOREIGN KEY ("roadmapId") REFERENCES "public"."Roadmap"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "StudySession" ADD CONSTRAINT "StudySession_currentModuleId_RoadmapModule_id_fk" FOREIGN KEY ("currentModuleId") REFERENCES "public"."RoadmapModule"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "StudyTask" ADD CONSTRAINT "StudyTask_sessionId_StudySession_id_fk" FOREIGN KEY ("sessionId") REFERENCES "public"."StudySession"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "StudyTask" ADD CONSTRAINT "StudyTask_topicId_RoadmapTopic_id_fk" FOREIGN KEY ("topicId") REFERENCES "public"."RoadmapTopic"("id") ON DELETE cascade ON UPDATE no action;