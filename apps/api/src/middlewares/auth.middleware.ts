import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/custom-errors";
import { env } from "../config/env";
import { userRepository } from "../repositories/user.repository";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Missing or malformed token");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new UnauthorizedError("Missing token");
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch (err) {
      throw new UnauthorizedError("Invalid or expired token");
    }

    if (!decoded || !decoded.userId) {
      throw new UnauthorizedError("Invalid token payload");
    }

    const user = await userRepository.findAuthUserById(decoded.userId);

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    // Attach user to request
    (req as any).user = user;
    next();
  } catch (error) {
    next(error);
  }
};
