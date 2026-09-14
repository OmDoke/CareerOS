import { app } from "./app";
import { env } from "./config/env";
import { logger } from "./utils/logger";

const start = () => {
  app.listen(env.PORT, () => {
    logger.info(`CareerOS API started on port ${env.PORT}`);
  });
};

start();
