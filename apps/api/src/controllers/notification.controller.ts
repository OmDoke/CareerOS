import { Request, Response, NextFunction } from "express";
import { notificationRepository } from "../repositories/notification.repository";
import { userRepository } from "../repositories/user.repository";

export class NotificationController {
  async getSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      let settings = await notificationRepository.findSettingsByUserId(userId);

      if (!settings) {
        settings = await notificationRepository.createSettings({ userId });
      }

      res.status(200).json(settings);
    } catch (error) {
      next(error);
    }
  }

  async updateSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const data = req.body;

      const settings = await notificationRepository.upsertSettings(
        userId,
        {
          telegramEnabled: data.telegramEnabled,
          reminderTime: data.reminderTime,
          timezone: data.timezone,
          weeklyReport: data.weeklyReport,
          motivationMessages: data.motivationMessages,
          practiceReminder: data.practiceReminder,
          reviewReminder: data.reviewReminder,
          studyReminder: data.studyReminder,
          quietHoursStart: data.quietHoursStart,
          quietHoursEnd: data.quietHoursEnd,
        },
        {
          userId,
          telegramEnabled: data.telegramEnabled ?? true,
          reminderTime: data.reminderTime ?? "09:00",
          timezone: data.timezone ?? "UTC",
          weeklyReport: data.weeklyReport ?? true,
          motivationMessages: data.motivationMessages ?? true,
          practiceReminder: data.practiceReminder ?? true,
          reviewReminder: data.reviewReminder ?? true,
          studyReminder: data.studyReminder ?? true,
          quietHoursStart: data.quietHoursStart,
          quietHoursEnd: data.quietHoursEnd,
        }
      );

      res.status(200).json(settings);
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const history = await notificationRepository.findLogsByUserId(userId, 50);

      res.status(200).json(history);
    } catch (error) {
      next(error);
    }
  }

  async testNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      // In a real scenario, this would be an admin endpoint or limited to the user's own token
      // We'll just call the service method directly here for testing if we made it public, 
      // but since it's private, we will just simulate a message
      const user = await userRepository.findById(userId);
      if (!user?.telegramChatId) {
        return res.status(400).json({ message: "Telegram not connected" });
      }

      const { telegramProvider } = await import("../providers/telegram.provider");
      const sent = await telegramProvider.sendMessage(user.telegramChatId, "🔔 *Test Notification* from CareerOS! Your connection is working perfectly.");
      
      if (sent) {
        await notificationRepository.createLog({
          userId,
          type: "TEST",
          message: "Test Notification",
          status: "DELIVERED"
        });
        res.status(200).json({ message: "Test notification sent" });
      } else {
        res.status(500).json({ message: "Failed to send notification" });
      }
    } catch (error) {
      next(error);
    }
  }
}

export const notificationController = new NotificationController();
