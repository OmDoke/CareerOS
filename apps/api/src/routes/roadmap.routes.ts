import { Router } from "express";
import { generateRoadmap, getRoadmap, getRoadmapById, deleteRoadmap } from "../controllers/roadmap.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validate.middleware";
import { generateRoadmapSchema } from "../validators/generate-roadmap.schema";

const router = Router();

router.use(requireAuth);

router.post("/generate", validateRequest(generateRoadmapSchema), generateRoadmap);
router.get("/", getRoadmap);
router.get("/:id", getRoadmapById);
router.delete("/", deleteRoadmap);

export default router;
