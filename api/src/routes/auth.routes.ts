import { Router } from "express";
import { loginRateLimiter } from "../middlewares/login-rate-limit.middleware.js";
import authController from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", loginRateLimiter, authController.signIn);

export default router;
