import { Request, Response, NextFunction } from "express";
import { analyticsService } from "../services/analytics.service";
import { AppError } from "../errors/custom-errors";

export class AnalyticsController {
  async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const analytics = await analyticsService.getDashboardAnalytics(userId);
      res.status(200).json(analytics);
    } catch (error) {
      next(error);
    }
  }

  async getProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const progress = await analyticsService.getProgressAnalytics(userId);
      res.status(200).json(progress);
    } catch (error) {
      next(error);
    }
  }
}

export const analyticsController = new AnalyticsController();
