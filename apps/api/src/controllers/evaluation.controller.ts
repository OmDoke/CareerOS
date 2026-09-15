import { Request, Response, NextFunction } from "express";
import { evaluationService } from "../services/evaluation.service";

export const evaluateAnswer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const result = await evaluationService.evaluateAnswer(userId, req.body);

    res.status(200).json({
      success: true,
      message: "Answer evaluated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const result = await evaluationService.getHistory(userId);

    res.status(200).json({
      success: true,
      message: "History retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAttemptById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const result = await evaluationService.getAttemptById(userId, id);

    res.status(200).json({
      success: true,
      message: "Attempt retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getStatistics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const result = await evaluationService.getStatistics(userId);

    res.status(200).json({
      success: true,
      message: "Statistics retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getTopicStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { topicId } = req.params;
    const result = await evaluationService.getTopicStats(userId, topicId);

    res.status(200).json({
      success: true,
      message: "Topic statistics retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
