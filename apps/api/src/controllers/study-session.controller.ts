import { Request, Response, NextFunction } from "express";
import { studySessionService } from "../services/study-session.service";

export const generateSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const session = await studySessionService.generateTodaySession(userId);
    
    res.status(201).json({
      success: true,
      message: "Session generated successfully",
      data: { session },
    });
  } catch (error) {
    next(error);
  }
};

export const getTodaySession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const session = await studySessionService.getTodaySession(userId);
    
    res.status(200).json({
      success: true,
      message: "Today's session fetched successfully",
      data: { session },
    });
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const history = await studySessionService.getHistory(userId);
    
    res.status(200).json({
      success: true,
      message: "History fetched successfully",
      data: { history },
    });
  } catch (error) {
    next(error);
  }
};

export const completeSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    
    const session = await studySessionService.completeSession(userId, id);
    
    res.status(200).json({
      success: true,
      message: "Session completed successfully",
      data: { session },
    });
  } catch (error) {
    next(error);
  }
};
