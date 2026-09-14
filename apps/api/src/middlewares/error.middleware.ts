import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { AppError } from "../errors/custom-errors";

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ success: false, message: err.message, errors: err.errors });
  }
  return res.status(500).json({ success: false, message: "Internal Server Error" });
};

export const notFoundMiddleware = (req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route Not Found" });
};
