import { Request, Response, NextFunction } from "express";
import { resumeService } from "../services/resume.service";

export const uploadResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const resume = await resumeService.uploadResume(userId, req.file as Express.Multer.File);
    res.status(201).json({
      success: true,
      message: "Resume uploaded successfully",
      data: { resume },
    });
  } catch (error) {
    next(error);
  }
};

export const getResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const resume = await resumeService.getResume(userId);
    res.status(200).json({
      success: true,
      message: "Resume fetched successfully",
      data: { resume },
    });
  } catch (error) {
    next(error);
  }
};

export const downloadResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { filePath, originalFileName } = await resumeService.getResumeFile(userId);
    res.download(filePath, originalFileName);
  } catch (error) {
    next(error);
  }
};

export const updateResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const resume = await resumeService.updateResume(userId, req.body);
    res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      data: { resume },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    await resumeService.deleteResume(userId);
    res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
