ALTER TABLE "User" ALTER COLUMN "createdAt" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "updatedAt" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "naukriUsername" text;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "naukriPassword" text;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "naukriSummary" text;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "naukriState" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "jobScraperUrl" text;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "jobScraperLocation" text;