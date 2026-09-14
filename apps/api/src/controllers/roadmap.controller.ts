import { Request, Response, NextFunction } from "express";
import { roadmapService } from "../services/roadmap.service";

export const generateRoadmap = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { targetRole, force } = req.body;
    
    const roadmap = await roadmapService.generateRoadmap(userId, targetRole, force);
    
    res.status(201).json({
      success: true,
      message: "Roadmap generated successfully",
      data: { roadmap },
    });
  } catch (error) {
    next(error);
  }
};

export const getRoadmap = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const roadmap = await roadmapService.getRoadmap(userId);
    
    res.status(200).json({
      success: true,
      message: "Roadmap fetched successfully",
      data: { roadmap },
    });
  } catch (error) {
    next(error);
  }
};

export const getRoadmapById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const roadmap = await roadmapService.getRoadmapById(id);
    
    res.status(200).json({
      success: true,
      message: "Roadmap fetched successfully",
      data: { roadmap },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRoadmap = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    await roadmapService.deleteRoadmap(userId);
    
    res.status(200).json({
      success: true,
      message: "Roadmap deleted successfully",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
