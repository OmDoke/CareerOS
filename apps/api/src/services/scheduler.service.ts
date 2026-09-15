import cron from "node-cron";
import { notificationService } from "./notification.service";
import { logger } from "../utils/logger";
import { prisma } from "../database";

export class SchedulerService {
  private hourlyJob: cron.ScheduledTask | null = null;

  public start() {
    logger.info("Initializing SchedulerService...");

    // Run every hour at minute 0
    this.hourlyJob = cron.schedule("0 * * * *", async () => {
      const startTime = Date.now();
      logger.info("Starting hourly notification processing...");

      try {
        await notificationService.processHourlyNotifications();
        
        const durationMs = Date.now() - startTime;
        logger.info(`Finished hourly notification processing in ${durationMs}ms`);
        
        await prisma.schedulerLog.create({
          data: {
            jobName: "HourlyNotifications",
            status: "SUCCESS",
            durationMs,
            usersProcessed: 0, // We can track this if we return it from notificationService
            messagesSent: 0,
            startedAt: new Date(startTime),
            completedAt: new Date(),
          }
        });
      } catch (error: any) {
        logger.error({ err: error }, "Error during hourly notification processing");
        
        await prisma.schedulerLog.create({
          data: {
            jobName: "HourlyNotifications",
            status: "FAILED",
            durationMs: Date.now() - startTime,
            usersProcessed: 0,
            messagesSent: 0,
            error: error.message || "Unknown error",
            startedAt: new Date(startTime),
            completedAt: new Date(),
          }
        });
      }
    });

    logger.info("SchedulerService started. Hourly jobs registered.");
  }

  public stop() {
    if (this.hourlyJob) {
      this.hourlyJob.stop();
      logger.info("SchedulerService stopped.");
    }
  }
}

export const schedulerService = new SchedulerService();
