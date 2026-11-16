import { Router } from "express";
import { Role } from "../generated/prisma/enums.js";
import employeeController from "../controllers/employee.controller.js";
import { ensureAuthenticated } from "../middlewares/auth.middleware.js";
import { allowedRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.post(
  "/",
  ensureAuthenticated,
  allowedRoles(Role.ADMIN),
  employeeController.create,
);
router.get("/me", ensureAuthenticated, employeeController.findMe);

export default router;
