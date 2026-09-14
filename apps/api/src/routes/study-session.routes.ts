import { Router } from "express";
import { generateSession, getTodaySession, getHistory, completeSession } from "../controllers/study-session.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);

router.post("/generate", generateSession);
router.get("/today", getTodaySession);
router.get("/history", getHistory);
router.patch("/:id/complete", completeSession);

export default router;
