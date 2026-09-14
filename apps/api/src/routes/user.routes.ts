import { Router } from "express";
import { getMe, updateProfile, changePassword } from "../controllers/user.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validate.middleware";
import { updateProfileSchema, changePasswordSchema } from "../validators/user.schema";

const router = Router();

router.use(requireAuth);

router.get("/me", getMe);
router.patch("/profile", validateRequest(updateProfileSchema), updateProfile);
router.patch("/change-password", validateRequest(changePasswordSchema), changePassword);

export default router;
