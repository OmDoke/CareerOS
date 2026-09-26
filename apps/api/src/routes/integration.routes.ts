import { Router } from "express";
import { updateNaukriSettings, updateJobScraperSettings, updateRapidApiSettings } from "../controllers/integration.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// Ensure only authenticated users can update their settings
router.use(requireAuth);

router.post("/naukri", updateNaukriSettings);
router.post("/job-scraper", updateJobScraperSettings);
router.post("/rapidapi", updateRapidApiSettings);

export default router;
