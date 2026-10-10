import employeeController from "../controllers/employee.controller.js";
import { Router } from "express";

const router = Router();

router.post("/", employeeController.create);

export default router;
