import { Router } from "express";
import { uploadResume, getResume, downloadResume, updateResume, deleteResume } from "../controllers/resume.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validate.middleware";
import { updateResumeSchema } from "../validators/update-resume.schema";
import { upload } from "../config/upload";

const router = Router();

router.use(requireAuth);

router.post("/upload", upload.single("resume"), uploadResume);
router.get("/", getResume);
router.get("/download", downloadResume);
router.patch("/", validateRequest(updateResumeSchema), updateResume);
router.delete("/", deleteResume);

export default router;
