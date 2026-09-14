import { Request, Response, NextFunction } from "express";
import { questionService } from "../services/question.service";

export const generateNextQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.id;
    const { sessionId, taskId } = req.body;

    const result = await questionService.generateNextQuestion(userId, sessionId, taskId);

    res.status(200).json({
      success: true,
      message: "Question generated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const skipQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.id;
    const { attemptId } = req.body;

    const result = await questionService.skipQuestion(userId, attemptId);

    res.status(200).json({
      success: true,
      message: "Question skipped",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getHint = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.id;
    const { attemptId, userAnswer } = req.body;

    const result = await questionService.getHint(userId, attemptId, userAnswer);

    res.status(200).json({
      success: true,
      message: "Hint generated",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getExplanation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.id;
    const { attemptId } = req.body;

    const result = await questionService.getExplanation(userId, attemptId);

    res.status(200).json({
      success: true,
      message: "Explanation generated",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
