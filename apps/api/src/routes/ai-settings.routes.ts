import { Router } from "express";
import { aiSettingsController } from "../controllers/ai-settings.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);

router.get("/", aiSettingsController.getSettings);
router.post("/", aiSettingsController.updateSettings);
router.patch("/", aiSettingsController.updateSettings);
router.delete("/", aiSettingsController.deleteSettings);

router.post("/test", aiSettingsController.testConnection);
router.get("/models", aiSettingsController.getModels);
router.post("/refresh-models", aiSettingsController.getModels); // Same functionality, explicit verb

export { router as aiSettingsRouter };
