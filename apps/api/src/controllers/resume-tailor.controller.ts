import { Request, Response, NextFunction } from "express";
import { resumeTailorService } from "../services/resume-tailor.service";
import { logger } from "../utils/logger";

export const tailorResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { jobDescription } = req.body;

    logger.info({ userId }, "Initiating resume tailoring");

    const tailoredResume = await resumeTailorService.tailorResume(userId, jobDescription);

    res.json({
      success: true,
      message: "Resume tailored successfully",
      data: tailoredResume,
    });
  } catch (error) {
    next(error);
  }
};
