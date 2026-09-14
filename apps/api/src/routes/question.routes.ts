import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validate.middleware";
import {
  generateNextQuestion,
  skipQuestion,
  getHint,
  getExplanation,
} from "../controllers/question.controller";
import {
  generateQuestionSchema,
  skipQuestionSchema,
  getHintSchema,
  getExplanationSchema,
} from "../validators/question.schema";

const router = Router();

router.use(requireAuth);

router.post("/next", validateRequest(generateQuestionSchema), generateNextQuestion);
router.post("/skip", validateRequest(skipQuestionSchema), skipQuestion);
router.post("/hint", validateRequest(getHintSchema), getHint);
router.post("/explain", validateRequest(getExplanationSchema), getExplanation);

export default router;
