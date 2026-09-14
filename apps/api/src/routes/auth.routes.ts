import { Router } from "express";
import { register, login, logout } from "../controllers/auth.controller";
import { validateRequest } from "../middlewares/validate.middleware";
import { registerSchema, loginSchema } from "../validators/auth.schema";

const router = Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/logout", logout);

export default router;
