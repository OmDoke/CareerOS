import { app } from "./app";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { schedulerService } from "./services/scheduler.service";
import { nseSession } from "./services/nse-session.service";

const start = async () => {
  app.listen(env.PORT, () => {
    logger.info(`CareerOS API started on port ${env.PORT}`);
    schedulerService.start();

    // Warm up NSE cookie session in the background (non-blocking)
    // This ensures the first /optionsignal scan has a fresh cookie ready
    nseSession.warmup().catch((err) =>
      logger.warn({ err }, "NSE session warmup failed — will retry on first request")
    );
  });
};

start();
