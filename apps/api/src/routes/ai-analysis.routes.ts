import { Router } from "express";
import { analyzeResume, getAnalysis } from "../controllers/ai-analysis.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validate.middleware";
import { analyzeResumeSchema } from "../validators/analyze-resume.schema";

const router = Router();

router.use(requireAuth);

router.post("/analyze", validateRequest(analyzeResumeSchema), analyzeResume);
router.get("/analysis", getAnalysis);

export default router;
