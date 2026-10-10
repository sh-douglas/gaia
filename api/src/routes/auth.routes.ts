import authController from "../controllers/auth.controller.js";
import { Router } from "express";

const router = Router();

router.post("/login", authController.signIn);

export default router;
