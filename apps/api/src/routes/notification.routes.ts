import { Router } from "express";
import { notificationController } from "../controllers/notification.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);

router.get("/settings", notificationController.getSettings);
router.patch("/settings", notificationController.updateSettings);
router.get("/history", notificationController.getHistory);
router.post("/test", notificationController.testNotification);

export default router;
