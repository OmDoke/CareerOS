import { Router } from "express";
import { telegramController } from "../controllers/telegram.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);

router.post("/connect", telegramController.connect);
router.post("/disconnect", telegramController.disconnect);
router.get("/status", telegramController.getStatus);

export default router;
