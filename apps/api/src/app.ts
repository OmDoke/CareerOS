import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorMiddleware, notFoundMiddleware } from "./middlewares/error.middleware";
import { logger } from "./utils/logger";
import { prisma } from "./database";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import resumeRoutes from "./routes/resume.routes";
import aiAnalysisRoutes from "./routes/ai-analysis.routes";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url }, "API Request");
  next();
});

app.get("/api/v1/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
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

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export { app };
