import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/auth.middleware.js";
import { allowedRoles } from "../middlewares/role.middleware.js";
import { Role } from "../generated/prisma/enums.js";
import { upload } from "../config/upload.js";
import doctorNoteController from "../controllers/doctor-note.controller.js";

const router = Router();

router.post(
  "/",
  ensureAuthenticated,
  allowedRoles(Role.OPERATOR),
  upload.array("files", 5),
  doctorNoteController.create,
);

export default router;
