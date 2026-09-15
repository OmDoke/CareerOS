import { prisma } from "../database";
import { telegramProvider } from "../providers/telegram.provider";
import { geminiProvider } from "../providers/gemini.provider";
import { logger } from "../utils/logger";
import { studySessionRepository } from "../repositories/study-session.repository";
import { roadmapRepository } from "../repositories/roadmap.repository";
import { analyticsService } from "./analytics.service";

export class NotificationService {
  async processHourlyNotifications() {
    // Determine the current UTC hour and day
    const now = new Date();
    const utcHour = now.getUTCHours();
    const isSunday = now.getUTCDay() === 0;

    // We want to send notifications to users based on their timezone and reminder time.
    // For simplicity, we assume users have reminderTime in HH:mm and timezone.
    // In a production system with real timezones, we'd use moment-timezone to check if it's the right local time.
    // Since we don't have moment-timezone installed and want to avoid massive overhead, 
    // we'll simulate it or just process everything if reminderTime matches the current UTC hour for now.
    
    // Instead, let's just find users whose settings state reminderTime hour == utcHour (assuming settings are stored in UTC for now)
    const hourStr = utcHour.toString().padStart(2, "0");
    
    const settings = await prisma.notificationSettings.findMany({
      where: {
        telegramEnabled: true,
        reminderTime: {
          startsWith: hourStr
        },
        user: {
          telegramConnected: true,
          telegramChatId: { not: null }
        }
      },
      include: {
        user: true
      }
    });

    for (const setting of settings) {
      if (!setting.user.telegramChatId) continue;
      const chatId = setting.user.telegramChatId;

      try {
        // 1. Weekly Report (Sundays)
        if (isSunday && setting.weeklyReport) {
          await this.sendWeeklyReport(setting.userId, chatId);
        }
        
        // 2. Study Reminder (Missed Session)
        if (setting.studyReminder) {
          await this.checkStudyReminder(setting.userId, chatId);
        }

        // 3. Motivation
        if (setting.motivationMessages) {
          await this.sendMotivation(setting.userId, chatId, setting.user.firstName || "");
        }
        
        // 4. Practice/Review Reminder
        if (setting.reviewReminder || setting.practiceReminder) {
          await this.checkTopicReminders(setting.userId, chatId);
        }

      } catch (error) {
        logger.error({ err: error, userId: setting.userId }, "Failed to process notifications for user");
      }
    }
  }

  private async checkStudyReminder(userId: string, chatId: string) {
    const todaySession = await studySessionRepository.findTodaySession(userId);
    if (!todaySession) {
      const roadmap = await roadmapRepository.findByUserId(userId);
      if (!roadmap) {
        await this.logAndSend(userId, chatId, "REMINDER", "Hey! You haven't generated a roadmap yet. Visit your dashboard to unlock your personalized curriculum.");
      } else {
        await this.logAndSend(userId, chatId, "REMINDER", "⏰ You haven't started today's study session yet! Jump in and keep your streak alive.");
      }
    } else if (todaySession.status !== "COMPLETED") {
      const remainingTasks = todaySession.tasks.filter((t: any) => t.status !== "COMPLETED").length;
      await this.logAndSend(userId, chatId, "REMINDER", `⏰ You still have ${remainingTasks} tasks remaining in today's study session. Finish strong!`);
    }
  }

  private async checkTopicReminders(userId: string, chatId: string) {
    const roadmap = await roadmapRepository.findByUserId(userId);
    if (!roadmap) return;
    
    const allTopics = roadmap.modules.flatMap(m => m.topics);
    const now = new Date();
    
    // Find one review due
    const reviewDue = allTopics.find(t => t.nextReviewDate && t.nextReviewDate <= now && t.status !== "PENDING");
    if (reviewDue) {
      await this.logAndSend(userId, chatId, "REVIEW", `📚 **Review Due:** It's time to revise *${reviewDue.title}*. Spaced repetition is key to retention!`);
      return; // Only send one to avoid spam
    }

    // Find one weak topic
    const weakTopic = allTopics.find(t => t.masteryPercentage < 50 && t.status !== "PENDING");
    if (weakTopic) {
      await this.logAndSend(userId, chatId, "PRACTICE", `💪 **Weak Topic Alert:** Your mastery for *${weakTopic.title}* is currently at ${weakTopic.masteryPercentage}%. A little practice goes a long way!`);
    }
  }

  private async sendMotivation(userId: string, chatId: string, firstName: string) {
    // Get context
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { roadmap: true } });
    if (!user) return;

    const streak = user.currentStreak;
    const targetRole = user.roadmap?.targetRole || "your dream role";

    const prompt = `Generate a short (2-3 sentences), highly personalized motivational message for a user named ${firstName}. 
    They are currently studying to become a ${targetRole}. 
    Their current study streak is ${streak} days. 
    Use a friendly, encouraging tone. Do not use markdown wrappers. Keep it concise. Add a relevant emoji.`;

    try {
      const motivation = await geminiProvider.generateContent(prompt, "gemini-3.6-flash");
      await this.logAndSend(userId, chatId, "MOTIVATION", motivation.trim());
    } catch (error) {
      logger.error({ err: error }, "Failed to generate motivation");
    }
  }

  private async sendWeeklyReport(userId: string, chatId: string) {
    const progress = await analyticsService.getProgressAnalytics(userId);
    const stats = await analyticsService.getDashboardAnalytics(userId);

    const questionsAnswered = progress.weeklyProgress.reduce((acc, curr) => acc + curr.questionsAnswered, 0);
    const studyHours = Math.round((progress.totalStudyTime / 60) * 10) / 10;
    
    const report = `📊 **Weekly Progress Report** 📊\n\n` +
      `🔥 **Current Streak:** ${stats.currentStreak} Days\n` +
      `⏱️ **Study Time (Week):** ${studyHours} Hours\n` +
      `🧠 **Questions Answered:** ${questionsAnswered}\n` +
      `🎯 **Average Score:** ${Math.round(stats.averageScore)}%\n\n` +
      `Keep up the great work! Let's crush next week's goals. 💪`;

    await this.logAndSend(userId, chatId, "WEEKLY_REPORT", report);
  }

  private async logAndSend(userId: string, chatId: string, type: string, message: string) {
    // Prevent duplicate exact messages within the last 12 hours
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
    const recent = await prisma.notificationLog.findFirst({
      where: {
        userId,
        type,
        message,
        createdAt: { gte: twelveHoursAgo }
      }
    });

    if (recent) return; // Skip to avoid spam

    const sent = await telegramProvider.sendMessage(chatId, message);

    await prisma.notificationLog.create({
      data: {
        userId,
        type,
        message,
        status: sent ? "DELIVERED" : "FAILED",
        error: sent ? null : "Telegram API Error"
      }
    });
  }
}

export const notificationService = new NotificationService();
