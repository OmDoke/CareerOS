import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorMiddleware, notFoundMiddleware } from "./middlewares/error.middleware";
import { logger } from "./utils/logger";
import pinoHttp from "pino-http";

import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import resumeRoutes from "./routes/resume.routes";
import aiAnalysisRoutes from "./routes/ai-analysis.routes";
import roadmapRoutes from "./routes/roadmap.routes";
import studySessionRoutes from "./routes/study-session.routes";
import questionRoutes from "./routes/question.routes";
import evaluationRoutes from "./routes/evaluation.routes";
import analyticsRoutes from "./routes/analytics.routes";
import telegramRoutes from "./routes/telegram.routes";
import notificationRoutes from "./routes/notification.routes";
import { aiSettingsRouter } from "./routes/ai-settings.routes";
import integrationRoutes from "./routes/integration.routes";

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}));
app.use(express.json());

app.use(pinoHttp({
  logger,
  customProps: (req) => ({
    userId: (req as any).user?.id,
  }),
  autoLogging: {
    ignore: (req) => req.url === "/api/v1/health", // Ignore noisy health checks
  }
}));

import { sql } from "drizzle-orm";
import { db } from "./db/database";

app.get("/api/v1/health", async (req, res) => {
  try {
    await db.execute(sql`SELECT 1`);
    res.json({ success: true, message: "CareerOS API Running", version: "1.0.0", database: "connected" });
  } catch (error) {
    logger.error({ error }, "Database connection failed");
    res.status(500).json({ success: false, message: "Database connection failed", database: "disconnected" });
  }
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/resume", resumeRoutes);
app.use("/api/v1/resume", aiAnalysisRoutes);
app.use("/api/v1/roadmap", roadmapRoutes);
app.use("/api/v1/study-session", studySessionRoutes);
app.use("/api/v1/questions", questionRoutes);
app.use("/api/v1/questions", evaluationRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/telegram", telegramRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/settings/ai", aiSettingsRouter);
app.use("/api/v1/settings/integrations", integrationRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export { app };
