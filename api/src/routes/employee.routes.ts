import { Router } from "express";
import employeeController from "../controllers/employee.controller.js";
import { ensureAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", employeeController.create);
router.get("/me", ensureAuthenticated, employeeController.findMe);

export default router;
