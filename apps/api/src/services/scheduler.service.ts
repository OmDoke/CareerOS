import cron from "node-cron";
import { notificationService } from "./notification.service";
import { telegramStudyService } from "./telegram-study.service";
import { logger } from "../utils/logger";
import { schedulerRepository } from "../repositories/scheduler.repository";
import { jobNotificationService } from "./job-notification.service";
import { scanAll, formatSignalMessage, isMarketOpen } from "./options-scanner.service";
import { telegramProvider } from "../providers/telegram.provider";
import { db } from "../db/database";

export class SchedulerService {
  private hourlyJob: cron.ScheduledTask | null = null;
  private dailyJob: cron.ScheduledTask | null = null;
  private marketJob: cron.ScheduledTask | null = null;

  public start() {
    logger.info("Initializing SchedulerService...");

    // Run every hour at minute 0
    this.hourlyJob = cron.schedule("0 * * * *", async () => {
      const startTime = Date.now();
      logger.info("Starting hourly notification processing...");

      try {
        await notificationService.processHourlyNotifications();
        await telegramStudyService.processHourlyQuestions();
        
        const durationMs = Date.now() - startTime;
        logger.info(`Finished hourly notification processing in ${durationMs}ms`);
        
        await schedulerRepository.createLog({
          jobName: "HourlyNotifications",
          status: "SUCCESS",
          durationMs,
          usersProcessed: 0, // We can track this if we return it from notificationService
          messagesSent: 0,
          startedAt: new Date(startTime),
          completedAt: new Date(),
        });
      } catch (error: any) {
        logger.error({ err: error }, "Error during hourly notification processing");
        
        await schedulerRepository.createLog({
          jobName: "HourlyNotifications",
          status: "FAILED",
          durationMs: Date.now() - startTime,
          usersProcessed: 0,
          messagesSent: 0,
          error: error.message || "Unknown error",
          startedAt: new Date(startTime),
          completedAt: new Date(),
        });
      }
    });
    // Run every day at 9:00 AM
    this.dailyJob = cron.schedule("0 9 * * *", async () => {
      logger.info("Starting daily job notification processing...");
      try {
        await jobNotificationService.processDailyJobAlerts();
      } catch (error: any) {
        logger.error({ err: error }, "Error during daily job alerts processing");
      }
    });

    // Run every 30 minutes during market hours (Mon–Fri, 9:15 AM – 3:30 PM IST)
    // Cron runs at :15 and :45 of each hour from 9 AM to 3 PM IST (UTC+5:30 = UTC 3:30–9:00)
    // We check isMarketOpen() inside to be precise about 9:15 open and 3:30 close
    this.marketJob = cron.schedule("15,45 3-9 * * 1-5", async () => {
      if (!isMarketOpen()) return;
      logger.info("Market hours auto-scan running...");

      try {
        const results = await scanAll();

        // Only alert on STRONG or MODERATE signals
        const strongResults = Object.values(results).filter(
          (r) => r && (r.strength === "STRONG" || r.strength === "MODERATE")
        );

        if (strongResults.length === 0) {
          logger.info("Market scan complete: no strong signals.");
          return;
        }

        // Find all Telegram-connected users
        const users = await db.query.users.findMany({
          where: (u, { eq }) => eq(u.telegramConnected, true),
        });

        for (const user of users) {
          if (!user.telegramChatId) continue;
          try {
            for (const result of strongResults) {
              if (!result) continue;
              const msg =
                `🔔 *Auto-Alert: ${result.strength} Signal Detected!*\n` +
                formatSignalMessage(result);
              await telegramProvider.sendMessage(user.telegramChatId, msg, { parse_mode: "Markdown" });
            }
          } catch (err) {
            logger.warn({ err, userId: user.id }, "Failed to send market alert to user");
          }
        }

        logger.info("Market hours auto-scan: sent alerts to %d users.", users.length);
      } catch (error: any) {
        logger.error({ err: error }, "Market hours auto-scan failed");
      }
    });

    logger.info("SchedulerService started. Hourly, daily, and market-hours jobs registered.");
  }

  public stop() {
    if (this.hourlyJob) this.hourlyJob.stop();
    if (this.dailyJob) this.dailyJob.stop();
    if (this.marketJob) this.marketJob.stop();
    logger.info("SchedulerService stopped.");
  }
}

export const schedulerService = new SchedulerService();
