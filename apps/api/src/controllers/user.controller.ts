import { Request, Response, NextFunction } from "express";
import { userService } from "../services/user.service";

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const user = await userService.getProfile(userId);
    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const user = await userService.updateProfile(userId, req.body);
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    await userService.changePassword(userId, req.body);
    res.status(200).json({
      success: true,
      message: "Password changed successfully",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
