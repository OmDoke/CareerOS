import { Router } from "express";
import {
  evaluateAnswer,
  getHistory,
  getAttemptById,
  getStatistics,
  getTopicStats
} from "../controllers/evaluation.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validate.middleware";
import { evaluateAnswerSchema } from "../validators/evaluation.schema";

const router = Router();

router.use(requireAuth);

router.post("/evaluate", validateRequest(evaluateAnswerSchema), evaluateAnswer);
router.get("/history", getHistory);
router.get("/history/:id", getAttemptById);
router.get("/statistics", getStatistics);
router.get("/topic/:topicId", getTopicStats);

export default router;
