import { Request, Response, NextFunction } from "express";
import { telegramService } from "../services/telegram.service";

export class TelegramController {
  async connect(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const token = await telegramService.generateConnectToken(userId);
      res.status(200).json({ token, botUsername: process.env.TELEGRAM_BOT_USERNAME || "CareerOSBot" });
    } catch (error) {
      next(error);
    }
  }

  async disconnect(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      await telegramService.disconnect(userId);
      res.status(200).json({ message: "Disconnected successfully" });
    } catch (error) {
      next(error);
    }
  }

  async getStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const status = await telegramService.getStatus(userId);
      res.status(200).json(status);
    } catch (error) {
      next(error);
    }
  }
}

export const telegramController = new TelegramController();
