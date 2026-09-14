import { Request, Response, NextFunction } from "express";
import { aiAnalysisService } from "../services/ai-analysis.service";

export const analyzeResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const force = req.body.force === true;
    
    const resume = await aiAnalysisService.analyzeResume(userId, force);
    
    res.status(200).json({
      success: true,
      message: "Resume analyzed successfully",
      data: { resume },
    });
  } catch (error) {
    next(error);
  }
};

export const getAnalysis = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const resume = await aiAnalysisService.getAnalysis(userId);
    
    res.status(200).json({
      success: true,
      message: "Analysis fetched successfully",
      data: { resume },
    });
  } catch (error) {
    next(error);
  }
};
