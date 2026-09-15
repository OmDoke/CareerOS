import { Router } from "express";
import { analyticsController } from "../controllers/analytics.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);

router.get("/dashboard", analyticsController.getDashboard);
router.get("/progress", analyticsController.getProgress);

export default router;
