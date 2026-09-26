import { Request, Response, NextFunction } from "express";
import { db } from "../db/database";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { logger } from "../utils/logger";

export const updateNaukriSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { email, password, profileSummary } = req.body;

    if (!email || !password || !profileSummary) {
      return res.status(400).json({ success: false, message: "Missing required Naukri fields" });
    }

    await db.update(users).set({
      naukriUsername: email,
      naukriPassword: password, 
      naukriSummary: profileSummary,
    }).where(eq(users.id, userId));

    logger.info({ userId }, "Updated Naukri settings");
    res.json({ success: true, message: "Naukri settings updated successfully." });
  } catch (error) {
    logger.error({ err: error }, "Failed to update Naukri settings");
    next(error);
  }
};

export const updateJobScraperSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { url, location } = req.body;

    await db.update(users).set({
      jobScraperUrl: url || null,
      jobScraperLocation: location || null,
    }).where(eq(users.id, userId));

    logger.info({ userId }, "Updated Job Scraper settings");
    res.json({ success: true, message: "Job scraper settings updated successfully." });
  } catch (error) {
    logger.error({ err: error }, "Failed to update job scraper settings");
    next(error);
  }
};

export const updateRapidApiSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { url, key, host } = req.body;

    if (!url || !key || !host) {
      return res.status(400).json({ success: false, message: "Missing required RapidAPI fields" });
    }

    await db.update(users).set({
      rapidApiUrl: url,
      rapidApiKey: key,
      rapidApiHost: host,
    }).where(eq(users.id, userId));

    logger.info({ userId }, "Updated RapidAPI settings");
    res.json({ success: true, message: "RapidAPI settings updated successfully." });
  } catch (error) {
    logger.error({ err: error }, "Failed to update RapidAPI settings");
    next(error);
  }
};
